#!/usr/bin/env node 
//got above line from ChatGPT REF: [1]
import * as fs from 'fs';

//get the mode from ./run {input}
let input_args: string[] = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
let filepath: string = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test

console.log(filepath);

//read the urls from the given filepath REF: [3]
const url_file = fs.readFileSync(filepath, 'utf-8'); //import file
const urls = url_file.split('\n'); //split the urls up
console.log(urls);

import * as dotenv from 'dotenv';

// get GitHub token from .env file
dotenv.config();
const TOKEN = process.env.GITHUB_TOKEN;

// interface constructor
interface GitHubResponse {
  data: {
    repository: {
      name: string;
      owner: {
        login: string;
      };
      forks: {
        totalCount: number;
      };
      issues: {
        totalCount: number;
        edges: Array<{
          node: {
            title: string;
            createdAt: string;
            closedAt: string | null; // closedAt can be null if the issue is still open
          };
        }>;
      };
      closedIssues: {
        totalCount: number; // Total number of closed issues
      };
      mentionableUsers: {
        edges: Array<{
          node: {
            login: string;
            url: string;
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: number; // Total number of contributions (commits, PRs, etc.)
              };
              commitContributionsByRepository: Array<{
                contributions: {
                  edges: Array<{
                    node: {
                      occurredAt: string; // Date of the first contribution
                    };
                  }>;
                };
              }>;
            };
          };
        }>;
      };
    };
  };
}

// GraphQL query to fetch GitHub repository data
const query = `
  query {
    repository(owner: "ECE-461-Team-16", name: "ACME-Project") {
      name
      owner {
        login
      }
      forks {
        totalCount
      }
      issues(last: 20) {
        totalCount
        edges {
          node {
            title
            createdAt
            closedAt
          }
        }
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      mentionableUsers(first: 100) {
        edges {
          node {
            login
            url
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
              commitContributionsByRepository(maxRepositories: 1) {
                contributions(first: 1, orderBy: { field: OCCURRED_AT, direction: ASC }) {
                  edges {
                    node {
                      occurredAt
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;


// single endpoint
const GITHUB_API_URL = 'https://api.github.com/graphql';

// Function to make API request using fetch
async function fetchGitHubData(): Promise<GitHubResponse> {
  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result: GitHubResponse = await response.json();
  return result;
}

// Function to print repository details
function printRepositoryDetails(repo: GitHubResponse['data']['repository']) {
  console.log('Repository:', repo.name);
  console.log('Owner:', repo.owner.login);
  console.log('Forks:', repo.forks.totalCount);
  console.log('Total Issues:', repo.issues.totalCount);
  console.log('Total Closed Issues:', repo.closedIssues.totalCount);
}

// Function to print issue details
function printIssueDetails(issues: GitHubResponse['data']['repository']['issues']) {
  if (issues.edges && issues.edges.length > 0) {
    console.log('\nIssue Details:');
    issues.edges.forEach((issue, index) => {
      console.log(`\nIssue ${index + 1}:`);
      console.log(`Title: ${issue.node.title}`);
      console.log(`Opened At: ${issue.node.createdAt}`);
      console.log(`Closed At: ${issue.node.closedAt || 'Still open'}`);
    });
  } else {
    console.log('No issue details available.');
  }
}

// Function to print mentionable user details
function printMentionableUsers(users: GitHubResponse['data']['repository']['mentionableUsers']) {
  let totalContributions = 0;
  if (users.edges && users.edges.length > 0) {
    console.log('\nMentionable Users:');
    users.edges.forEach((user, index) => {
      const contributions = user.node.contributionsCollection.contributionCalendar.totalContributions;
      totalContributions += contributions;

      // Get the first contribution date, if available
      const firstContribution = user.node.contributionsCollection.commitContributionsByRepository?.[0]?.contributions?.edges?.[0]?.node?.occurredAt || 'No contributions';

      console.log(`\nUser ${index + 1}:`);
      console.log(`Username: ${user.node.login}`);
      console.log(`Profile URL: ${user.node.url}`);
      console.log(`Total Contributions: ${contributions}`);
      console.log(`First Contribution Date: ${firstContribution}`);
    });
    console.log(`\nTotal Contributions from All Mentionable Users: ${totalContributions}`);
  } else {
    console.log('No mentionable users available.');
  }
}

// Fetch data and print the details using the functions
fetchGitHubData()
  .then((info) => {
    const repo = info.data.repository;
    printRepositoryDetails(repo);
    printIssueDetails(repo.issues);
    printMentionableUsers(repo.mentionableUsers);
  })
  .catch((error) => {
    console.error('Error fetching GitHub data:', error);
  });
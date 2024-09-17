import * as dotenv from 'dotenv';
import logger from './logger';
logger.info('Hi there!'); // testing logger

// stuff to grab token from .env file
dotenv.config();
const TOKEN = process.env.GITHUB_TOKEN;

const GITHUB_API_URL = 'https://api.github.com/graphql';

async function fetchRepositoryInfo(owner: string, name: string) {
  const query = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        name
        owner {
          login
        }
        forks {
          totalCount
        }
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 10) {
                edges {
                  node {
                    committedDate
                    author {
                      name
                    }
                    message
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data.repository;
}

// Example call
fetchRepositoryInfo('browserify', 'browserify')
  .then((repoInfo) => console.log('Repository Info:', repoInfo))
  .catch((error) => console.error(error.message));

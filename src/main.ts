#!/usr/bin/env node 
//got above line from ChatGPT REF: [1]
import * as fs from 'fs';

// import logger
import logger from './logger'; 

//get the mode from ./run {input}
let input_args: string[] = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
let filepath: string = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test

//read the urls from the given filepath REF: [3]
const url_file = fs.readFileSync(filepath, 'utf-8'); //import file
const urls = url_file.split('\n'); //split the urls up


// import fetch/print functions and interfaces
import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues,
                              RepositoryInfo, RepositoryIssues, RepositoryUsers,
                              printRepositoryUsers, printRepositoryIssues, printRepositoryInfo,
                              getNpmPackageGithubRepo 
                            } from './GtiHubAPIcaller';
import { getLicense } from './License';

// Get the GitHub repository URL for a given NPM package
export async function processPackageData(packageName: string): Promise<string> {
  const githubRepo = await getNpmPackageGithubRepo(packageName);
  
  if (githubRepo) {
      // console.log(`GitHub Repository for ${packageName}: ${githubRepo}`);
      // Return the GitHub repository URL
      return githubRepo;
  } else {
      console.log(`No GitHub repository found for ${packageName}`);
      // exit(1);
      //**LOGGING - we need better log here
      return "";
  }
}


function calculateBusFactorScore(users: RepositoryUsers): number {
  // get total contributions for each user
  const contributions = users.data.repository.mentionableUsers.edges.map(
    (user) => user.node.contributionsCollection.contributionCalendar.totalContributions
  );

  // get total contributions by everyone
  const totalContributions = contributions.reduce((acc, val) => acc + val, 0);

  // total number users
  const totalUsers = contributions.length;

  // average contribution per person
  const averageContribution = totalContributions / totalUsers;

  // get number of users with contributions >= average contributions per person
  const aboveAverageContributors = contributions.filter(
    (contribution) => contribution >= averageContribution
  ).length;

  const busFactorScore = aboveAverageContributors / totalUsers;

  // round to the nearest hundredth
  return Math.round(busFactorScore * 100) / 100;
}

function calculateCorrectness(issues: RepositoryIssues): number {
  const totalIssues = issues.data.repository.issues.totalCount;
  const completedIssues = issues.data.repository.closedIssues.totalCount;

  if(totalIssues === 0) {
    return 1;
  }

  const correctness = completedIssues / totalIssues;

  // round to the nearest hundredth
  return Math.round(correctness * 100) / 100;
}

function calculateRampUpScore(users: RepositoryUsers): number {
  // get first contribution date for each user (from ChatGPT)
  const firstContributionDates: number[] = users.data.repository.mentionableUsers.edges
    .map((user) => {
      const contributionDates = user.node.contributionsCollection.commitContributionsByRepository.flatMap((repo) =>
        repo.contributions.edges.map((contribution) => new Date(contribution.node.occurredAt).getTime())
      );
      return contributionDates.length ? Math.min(...contributionDates) : null;
    })
    .filter((date) => date !== null) as number[];

  // if no valid contribution dates, return 0 as the score.
  // need at least two contributors to calculate the average
  if(firstContributionDates.length < 2) {    
    return 0;
  }

  // find the time differences between contributors (in weeks) 
  const timeDifferences: number[] = [];
  for (let i = 1; i < firstContributionDates.length; i++) {
    const diffInWeeks = (firstContributionDates[i] - firstContributionDates[i - 1]) / (1000 * 3600 * 24 * 7);
    timeDifferences.push(diffInWeeks);
  }

  // find average (in weeks)
  const averageTimeDifference = timeDifferences.reduce((acc, val) => acc + val, 0) / timeDifferences.length;

  const rampUpScore = 1 / averageTimeDifference;

  // round to the nearest hundredth
  return Math.round(rampUpScore * 100) / 100;
}

function calculateResponsiveMaintainerScore(issues: RepositoryIssues): number {
  // get date one month ago from today
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1); // set for one month ago

  // get issue creation and closed dates from past month (from ChatGPT)
  const recentIssues = issues.data.repository.issues.edges.filter((issue) => {
    const createdAt = new Date(issue.node.createdAt);
    return createdAt >= oneMonthAgo;
  });

  // get total number of issues created within the past month
  const totalIssues = recentIssues.length;

  // get number of resolved issues within the past month
  const resolvedIssues = recentIssues.filter((issue) => issue.node.closedAt !== null).length;

  // if no issues were created in the past month
  if(totalIssues === 0) {
    return 0;
  }

  const responsiveMaintainer = resolvedIssues / totalIssues;

  // round to the nearest hundredth
  return Math.round(responsiveMaintainer * 100) / 100;
}


/////////////// FOR TESTING //////////////

// const owner = 'ECE-461-Team-16'; 
// const repository = 'ACME-Project';

// can delete the section below if you want

// const owner = 'nullivex';
// const repository = 'nodist';

// const owner = 'browserify';
// const repository = 'browserify';

// const owner = 'cloudinary';
// const repository = 'cloudinary_npm';

// const owner = 'lodash';
// const repository = 'lodash';

// const owner = 'expressjs';
// const repository = 'express';

// const owner = 'mrdoob';
// const repository = 'three.js';

// const owner = 'prathameshnetake;
// const repository = 'libvlc';

//////////////////////////////////////////
for( let i = 0; i < urls.length; i++){ //loop through all of the urls
  
  
  // Non-API metric calculations
  // const foundLicense : number = getLicense(urls[i], repository); // get the license for the repo


  (async () => {
    try {

      //Get data from url
      let link_split = urls[i].split("/"); //splits each url into different parts

      let owner : string;
      let repository : string;

      owner = "";
      repository = "";

      if( link_split[2] === "github.com" ){ //if its github we can just use owner repository from url
        owner = link_split[3];
        // repository = link_split[4];
        repository = link_split[4].replace(".git", "");
      }
      
      // ** STILL NEEDS TO BE FIXED **
      else if( link_split[2] === "www.npmjs.com" ){
        //whatever our get link for npm will be (hard coding with working test case for now)
        const githubRepoOut = await processPackageData(link_split[4]);
        urls[i] = githubRepoOut; //fix for licsense

        // console.log("****NPM URL: " + githubRepoOut);
        let link_split_npm = githubRepoOut.split("/"); //splits each url into different parts

        owner = link_split_npm[3];
        repository = link_split_npm[4].replace(".git", "");

        // console.log('OWNER: ' + owner + '\nREPOSITORY: ' + repository);

      }
      else{
        console.log("error");
      }
      //get non-api metrics
      const foundLicense: number = await getLicense(urls[i], repository);

      // get inferfaces to get all metrics for repository information
      const repoInfo:   RepositoryInfo   = await fetchRepositoryInfo(owner, repository);
      const repoIssues: RepositoryIssues = await fetchRepositoryIssues(owner, repository);
      const repoUsers:  RepositoryUsers  = await fetchRepositoryUsers(owner, repository);
      
      // API metric calculations
      const busFactor           = calculateBusFactorScore(repoUsers);
      const correctness         = calculateCorrectness(repoIssues);
      const rampUp              = calculateRampUpScore(repoUsers);
      const responsiveMaintainer = calculateResponsiveMaintainerScore(repoIssues);

      // print out scores (for testing)
      console.log('Repository:   ', repository);
      console.log('Bus Factor:  ', busFactor);
      console.log('Correctness: ', correctness);
      console.log('Ramp Up:     ', rampUp);
      console.log('Responsive Maintainer: ', responsiveMaintainer);
      console.log('License Found: ', foundLicense);
  } 
  catch (error) {
    console.error('Error:', error); 
  }
  })();
  
}

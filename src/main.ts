#!/usr/bin/env node 
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger'; 

// Get the mode from ./run {input}
let input_args: string[] = process.argv.slice(2); // gets user arguments passed in from run bash script
let filepath: string = input_args.length > 0 ? input_args[0] : "test.txt"; // default to "test.txt" if no argument

// Declare urls in the outer scope so it's accessible throughout the script
let urls: string[] = [];

// Exported functions for file validation

export function validateFilePath(filepath: string): void {
    // Check if the file exists
    if (!fs.existsSync(filepath)) {
        logger.error(`File not found: ${filepath}`);
        throw new Error(`Invalid file path: ${filepath}`);
    }

    // Check if the file has the correct .txt extension
    if (path.extname(filepath) !== '.txt') {
        logger.error(`File is not a .txt file: ${filepath}`);
        throw new Error(`Only .txt files are allowed: ${filepath}`);
    }
}

export function validateFileContent(urls: string[]): void {
    const urlRegex = /^(https:\/\/github\.com\/|https:\/\/www\.npmjs\.com\/)/;
    
    for (const url of urls) {
        if (url.trim() !== '' && !urlRegex.test(url)) {
            logger.error(`Invalid URL found in file: ${url}`);
            throw new Error(`File contains invalid URLs: ${url}`);
        }
    }
}

// Run validation
try {
    validateFilePath(filepath); // Validate the file path
    
    // Read the URLs from the given filepath
    const url_file = fs.readFileSync(filepath, 'utf-8'); // import file
    urls = url_file.split('\n').map(url => url.trim()); // split and trim the urls
    
    validateFileContent(urls); // Validate file content
    logger.info('File validation passed');
    
} catch (error) {
  const err = error as Error;
  logger.error(`Invalid file detected: ${filepath}. Reason: ${err.message}`);
  process.exit(1); // Exit with error status
}


// import fetch/print functions and interfaces
import calculateNetScore, { calculateBusFactorScore, calculateCorrectness,
                            calculateRampUpScore, calculateResponsiveMaintainerScore
                          } from './CalculateMetrics';


import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues,
                              RepositoryInfo, RepositoryIssues, RepositoryUsers,
                              printRepositoryUsers, printRepositoryIssues, printRepositoryInfo, 
                              getNpmPackageGithubRepo
                            } from './GitHubAPIcaller';
                          

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
      
      //variables for latency calculations
      let start : number;
      let end : number;

      let netScoreStart : number;
      let netScoreEnd : number;

      netScoreStart = performance.now();

      //get non-api metrics
      start = performance.now();
      const foundLicense: number = await getLicense(urls[i], repository);
      end = performance.now();
      const foundLicenseLatency = ((end - start) / 1000).toFixed(3);

      // get inferfaces to get all metrics for repository information
      const repoInfo:   RepositoryInfo   = await fetchRepositoryInfo(owner, repository);
      const repoIssues: RepositoryIssues = await fetchRepositoryIssues(owner, repository);
      const repoUsers:  RepositoryUsers  = await fetchRepositoryUsers(owner, repository);

      // API metric calculations
      //bus factor
      start = performance.now();
      const busFactor           = calculateBusFactorScore(repoUsers);
      end = performance.now();
      const busFactorLatency    = ((end - start) / 1000).toFixed(3);
      
      //correctness
      start = performance.now();
      const correctness         = calculateCorrectness(repoIssues);
      end = performance.now();
      const correctnessLatency  = ((end - start) / 1000).toFixed(3);

      //ramp up
      start = performance.now();
      const rampUp              = calculateRampUpScore(repoUsers);
      end = performance.now();
      const rampUpLatency       = ((end - start) / 1000).toFixed(3);

      //responsive maintainer
      start = performance.now();
      const responsiveMaintainer = calculateResponsiveMaintainerScore(repoIssues);
      end = performance.now();
      const responsiveMaintainerLatency = ((end - start) / 1000).toFixed(3);

      //net score
      const netScore = calculateNetScore(busFactor, correctness, responsiveMaintainer, rampUp, foundLicense);

      netScoreEnd = performance.now();

      const netScoreLatency = ((netScoreEnd - netScoreStart) / 1000).toFixed(3);


      // print out scores (for testing)
      console.log('Repository:  ', repository);
      console.log('NetScore:     ', netScore);
      console.log('NetScore Latency:     ', netScoreLatency);
      console.log('Bus Factor:  ', busFactor);
      console.log('Bus Factor Latency:  ', busFactorLatency);
      console.log('Correctness: ', correctness);
      console.log('Correctness Latency: ', correctnessLatency);
      console.log('Ramp Up:     ', rampUp);
      console.log('Ramp Up Latency:     ', rampUpLatency);
      console.log('Responsive Maintainer: ', responsiveMaintainer);
      console.log('Responsive Maintainer Latency: ', responsiveMaintainerLatency);
      console.log('License Found: ', foundLicense);
      console.log('License Latency: ', foundLicenseLatency);
  } 
  catch (error) {
    console.error('Error:', error); 
  }
  })();
  
}

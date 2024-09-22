#!/usr/bin/env node 
//got above line from ChatGPT REF: [1]
import * as fs from 'fs';

// import logger
import logger from './logger'; 

const logFile = process.env.LOG_FILE;
const githubToken = process.env.GITHUB_TOKEN;

// Exit with an error code if the required environment variables are not set
if (!logFile || !githubToken) {
  logger.error("Error: LOG_FILE or GITHUB_TOKEN environment variable is not set.");
  process.exit(1); // Exit unsuccessfully
}

//get the mode from ./run {input}
let input_args: string[] = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
let filepath: string = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test

// Read the URLs from the given filepath
// Read the URLs from the given filepath
const url_file = fs.readFileSync(filepath, 'utf-8'); // Import file

// Split the URLs, trim whitespace, and filter out any empty lines
const urls = url_file
  .split('\n')
  .map(url => url.trim())
  .filter(url => url.length > 0); // Filter out blank lines



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

interface RepositoryMetrics {
  URL: string;
  NetScore: number;
  NetScore_Latency: number;
  RampUp: number;
  RampUp_Latency: number;
  Correctness: number;
  Correctness_Latency: number;
  BusFactor: number;
  BusFactor_Latency: number;
  ResponsiveMaintainer: number;
  ResponsiveMaintainer_Latency: number;
  License: number;
  License_Latency: number;
}

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
      // console.log('Repository:  ', repository);
      // console.log('NetScore:     ', netScore);
      // console.log('NetScore Latency:     ', netScoreLatency);
      // console.log('Bus Factor:  ', busFactor);
      // console.log('Bus Factor Latency:  ', busFactorLatency);
      // console.log('Correctness: ', correctness);
      // console.log('Correctness Latency: ', correctnessLatency);
      // console.log('Ramp Up:     ', rampUp);
      // console.log('Ramp Up Latency:     ', rampUpLatency);
      // console.log('Responsive Maintainer: ', responsiveMaintainer);
      // console.log('Responsive Maintainer Latency: ', responsiveMaintainerLatency);
      // console.log('License Found: ', foundLicense);
      // console.log('License Latency: ', foundLicenseLatency);

    
      // Assuming each variable is defined correctly for each URL
      var output_string = `{"URL":"${urls[i]}", "NetScore":${netScore}, "NetScore_Latency": ${netScoreLatency}, "RampUp":${rampUp}, "RampUp_Latency": ${rampUpLatency}, "Correctness":${correctness}, "Correctness_Latency":${correctnessLatency}, "BusFactor":${busFactor}, "BusFactor_Latency": ${busFactorLatency}, "ResponsiveMaintainer":${responsiveMaintainer}, "ResponsiveMaintainer_Latency": ${responsiveMaintainerLatency}, "License":${foundLicense}, "License_Latency": ${foundLicenseLatency}}`;
      
      // Only write the JSON object followed by a newline
      process.stdout.write(output_string + '\n');

    
      

  } 
  catch (error) {
    console.error('Error:', error); 
  }
  })();
  
}

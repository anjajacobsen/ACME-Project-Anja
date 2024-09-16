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


// import fetch/print functions and interfaces
import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues,
                              RepositoryInfo, RepositoryIssues, RepositoryUsers,
                              printRepositoryUsers, printRepositoryIssues, printRepositoryInfo 
                            } from './GtiHubAPIcaller';


for( let i = 0; i < urls.length; i++){ //loop through all of the urls
  let link_split = urls[i].split("/");

  let owner : string;
  let repository : string;

  if( link_split[2] === "github.com" ){
    console.log("GITHUB");
    owner = link_split[3];
    repository = link_split[4];
  }
  if( link_split[2] === "www.npmjs.com" ){
    //whatever our get link for npm will be (hard coding with working test case for now)
    console.log("NPMJS");
    owner = "browserify";
    repository = "browserify";
  }


  // const owner = 'ECE-461-Team-16';
  // const repository = 'ACME-Project';

  (async () => {
    try {

      const test: RepositoryInfo = await fetchRepositoryInfo(owner, repository);
      const test2: RepositoryIssues = await fetchRepositoryIssues(owner, repository);
      const test3: RepositoryUsers = await fetchRepositoryUsers(owner, repository);

      // Print repository information
      printRepositoryInfo(test);
      printRepositoryIssues(test2);
      printRepositoryUsers(test3);

    } 
    catch (error) {
      console.error('Error:', error); 
    }
  })();
}


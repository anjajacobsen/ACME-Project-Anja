#!/usr/bin/env node 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//got above line from ChatGPT REF: [1]
var fs = require("fs");
//get the mode from ./run {input}
var input_args = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
var filepath = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test
console.log(filepath);
//read the urls from the given filepath REF: [3]
var url_file = fs.readFileSync(filepath, 'utf-8'); //import file
var urls = url_file.split('\n'); //split the urls up
console.log(urls);

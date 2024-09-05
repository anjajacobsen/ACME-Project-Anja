#!/usr/bin/env node 
//got above line from ChatGPT [1]
//get the mode from ./run {input}
var input_args = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
var mode = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test
console.log(mode);

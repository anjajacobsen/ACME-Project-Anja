#!/usr/bin/env node 
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFilePath = validateFilePath;
exports.validateFileContent = validateFileContent;
exports.processPackageData = processPackageData;
var fs = require("fs");
var path = require("path");
var logger_1 = require("./logger");
// Get the mode from ./run {input}
var input_args = process.argv.slice(2); // gets user arguments passed in from run bash script
var filepath = input_args.length > 0 ? input_args[0] : "test.txt"; // default to "test.txt" if no argument
// Declare urls in the outer scope so it's accessible throughout the script
var urls = [];
// Exported functions for file validation
function validateFilePath(filepath) {
    // Check if the file exists
    if (!fs.existsSync(filepath)) {
        logger_1.default.error("File not found: ".concat(filepath));
        throw new Error("Invalid file path: ".concat(filepath));
    }
    // Check if the file has the correct .txt extension
    if (path.extname(filepath) !== '.txt') {
        logger_1.default.error("File is not a .txt file: ".concat(filepath));
        throw new Error("Only .txt files are allowed: ".concat(filepath));
    }
}
function validateFileContent(urls) {
    var urlRegex = /^(https:\/\/github\.com\/|https:\/\/www\.npmjs\.com\/)/;
    for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
        var url = urls_1[_i];
        if (url.trim() !== '' && !urlRegex.test(url)) {
            logger_1.default.error("Invalid URL found in file: ".concat(url));
            throw new Error("File contains invalid URLs: ".concat(url));
        }
    }
}
// Run validation
try {
    validateFilePath(filepath); // Validate the file path
    // Read the URLs from the given filepath
    var url_file = fs.readFileSync(filepath, 'utf-8'); // import file
    urls = url_file.split('\n').map(function (url) { return url.trim(); }); // split and trim the urls
    validateFileContent(urls); // Validate file content
    logger_1.default.info('File validation passed');
}
catch (error) {
    var err = error;
    logger_1.default.error("Invalid file detected: ".concat(filepath, ". Reason: ").concat(err.message));
    process.exit(1); // Exit with error status
}
// import fetch/print functions and interfaces
var CalculateMetrics_1 = require("./CalculateMetrics");
var GitHubAPIcaller_1 = require("./GitHubAPIcaller");
var License_1 = require("./License");
// Get the GitHub repository URL for a given NPM package
function processPackageData(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var githubRepo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, GitHubAPIcaller_1.getNpmPackageGithubRepo)(packageName)];
                case 1:
                    githubRepo = _a.sent();
                    if (githubRepo) {
                        // console.log(`GitHub Repository for ${packageName}: ${githubRepo}`);
                        // Return the GitHub repository URL
                        return [2 /*return*/, githubRepo];
                    }
                    else {
                        console.log("No GitHub repository found for ".concat(packageName));
                        // exit(1);
                        //**LOGGING - we need better log here
                        return [2 /*return*/, ""];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var _loop_1 = function (i) {
    // Non-API metric calculations
    // const foundLicense : number = getLicense(urls[i], repository); // get the license for the repo
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var link_split, owner, repository, githubRepoOut, link_split_npm, start, end, netScoreStart, netScoreEnd, foundLicense, foundLicenseLatency, repoInfo, repoIssues, repoUsers, busFactor, busFactorLatency, correctness, correctnessLatency, rampUp, rampUpLatency, responsiveMaintainer, responsiveMaintainerLatency, netScore, netScoreLatency, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    link_split = urls[i].split("/");
                    owner = void 0;
                    repository = void 0;
                    owner = "";
                    repository = "";
                    if (!(link_split[2] === "github.com")) return [3 /*break*/, 1];
                    owner = link_split[3];
                    // repository = link_split[4];
                    repository = link_split[4].replace(".git", "");
                    return [3 /*break*/, 4];
                case 1:
                    if (!(link_split[2] === "www.npmjs.com")) return [3 /*break*/, 3];
                    return [4 /*yield*/, processPackageData(link_split[4])];
                case 2:
                    githubRepoOut = _a.sent();
                    urls[i] = githubRepoOut; //fix for licsense
                    link_split_npm = githubRepoOut.split("/");
                    owner = link_split_npm[3];
                    repository = link_split_npm[4].replace(".git", "");
                    return [3 /*break*/, 4];
                case 3:
                    console.log("error");
                    _a.label = 4;
                case 4:
                    start = void 0;
                    end = void 0;
                    netScoreStart = void 0;
                    netScoreEnd = void 0;
                    netScoreStart = performance.now();
                    //get non-api metrics
                    start = performance.now();
                    return [4 /*yield*/, (0, License_1.getLicense)(urls[i], repository)];
                case 5:
                    foundLicense = _a.sent();
                    end = performance.now();
                    foundLicenseLatency = ((end - start) / 1000).toFixed(3);
                    return [4 /*yield*/, (0, GitHubAPIcaller_1.default)(owner, repository)];
                case 6:
                    repoInfo = _a.sent();
                    return [4 /*yield*/, (0, GitHubAPIcaller_1.fetchRepositoryIssues)(owner, repository)];
                case 7:
                    repoIssues = _a.sent();
                    return [4 /*yield*/, (0, GitHubAPIcaller_1.fetchRepositoryUsers)(owner, repository)];
                case 8:
                    repoUsers = _a.sent();
                    // API metric calculations
                    //bus factor
                    start = performance.now();
                    busFactor = (0, CalculateMetrics_1.calculateBusFactorScore)(repoUsers);
                    end = performance.now();
                    busFactorLatency = ((end - start) / 1000).toFixed(3);
                    //correctness
                    start = performance.now();
                    correctness = (0, CalculateMetrics_1.calculateCorrectness)(repoIssues);
                    end = performance.now();
                    correctnessLatency = ((end - start) / 1000).toFixed(3);
                    //ramp up
                    start = performance.now();
                    rampUp = (0, CalculateMetrics_1.calculateRampUpScore)(repoUsers);
                    end = performance.now();
                    rampUpLatency = ((end - start) / 1000).toFixed(3);
                    //responsive maintainer
                    start = performance.now();
                    responsiveMaintainer = (0, CalculateMetrics_1.calculateResponsiveMaintainerScore)(repoIssues);
                    end = performance.now();
                    responsiveMaintainerLatency = ((end - start) / 1000).toFixed(3);
                    netScore = (0, CalculateMetrics_1.default)(busFactor, correctness, responsiveMaintainer, rampUp, foundLicense);
                    netScoreEnd = performance.now();
                    netScoreLatency = ((netScoreEnd - netScoreStart) / 1000).toFixed(3);
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
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); })();
};
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
for (var i = 0; i < urls.length; i++) {
    _loop_1(i);
}

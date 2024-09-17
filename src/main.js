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
// import fetch/print functions and interfaces
var GtiHubAPIcaller_1 = require("./GtiHubAPIcaller");
var License_1 = require("./License");
function calculateBusFactorScore(users) {
    // get total contributions for each user
    var contributions = users.data.repository.mentionableUsers.edges.map(function (user) { return user.node.contributionsCollection.contributionCalendar.totalContributions; });
    // get total contributions by everyone
    var totalContributions = contributions.reduce(function (acc, val) { return acc + val; }, 0);
    // total number users
    var totalUsers = contributions.length;
    // average contribution per person
    var averageContribution = totalContributions / totalUsers;
    // get number of users with contributions >= average contributions per person
    var aboveAverageContributors = contributions.filter(function (contribution) { return contribution >= averageContribution; }).length;
    var busFactorScore = aboveAverageContributors / totalUsers;
    // round to the nearest hundredth
    return Math.round(busFactorScore * 100) / 100;
}
function calculateCorrectness(issues) {
    var totalIssues = issues.data.repository.issues.totalCount;
    var completedIssues = issues.data.repository.closedIssues.totalCount;
    if (totalIssues === 0) {
        return 1;
    }
    var correctness = completedIssues / totalIssues;
    // round to the nearest hundredth
    return Math.round(correctness * 100) / 100;
}
function calculateRampUpScore(users) {
    // get first contribution date for each user (from ChatGPT)
    var firstContributionDates = users.data.repository.mentionableUsers.edges
        .map(function (user) {
        var contributionDates = user.node.contributionsCollection.commitContributionsByRepository.flatMap(function (repo) {
            return repo.contributions.edges.map(function (contribution) { return new Date(contribution.node.occurredAt).getTime(); });
        });
        return contributionDates.length ? Math.min.apply(Math, contributionDates) : null;
    })
        .filter(function (date) { return date !== null; });
    // if no valid contribution dates, return 0 as the score.
    // need at least two contributors to calculate the average
    if (firstContributionDates.length < 2) {
        return 0;
    }
    // find the time differences between contributors (in weeks) 
    var timeDifferences = [];
    for (var i = 1; i < firstContributionDates.length; i++) {
        var diffInWeeks = (firstContributionDates[i] - firstContributionDates[i - 1]) / (1000 * 3600 * 24 * 7);
        timeDifferences.push(diffInWeeks);
    }
    // find average (in weeks)
    var averageTimeDifference = timeDifferences.reduce(function (acc, val) { return acc + val; }, 0) / timeDifferences.length;
    var rampUpScore = 1 / averageTimeDifference;
    // round to the nearest hundredth
    return Math.round(rampUpScore * 100) / 100;
}
function calculateResponsiveMaintainerScore(issues) {
    // get date one month ago from today
    var currentDate = new Date();
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1); // set for one month ago
    // get issue creation and closed dates from past month (from ChatGPT)
    var recentIssues = issues.data.repository.issues.edges.filter(function (issue) {
        var createdAt = new Date(issue.node.createdAt);
        return createdAt >= oneMonthAgo;
    });
    // get total number of issues created within the past month
    var totalIssues = recentIssues.length;
    // get number of resolved issues within the past month
    var resolvedIssues = recentIssues.filter(function (issue) { return issue.node.closedAt !== null; }).length;
    // if no issues were created in the past month
    if (totalIssues === 0) {
        return 0;
    }
    var responsiveMaintainer = resolvedIssues / totalIssues;
    // round to the nearest hundredth
    return Math.round(responsiveMaintainer * 100) / 100;
}
var _loop_1 = function (i) {
    var link_split = urls[i].split("/"); //splits each url into different parts
    var owner;
    var repository;
    owner = "";
    repository = "";
    if (link_split[2] === "github.com") { //if its github we can just use owner repository from url
        owner = link_split[3];
        // repository = link_split[4];
        repository = link_split[4].replace(".git", "");
    }
    // ** STILL NEEDS TO BE FIXED **
    else if (link_split[2] === "www.npmjs.com") {
        //whatever our get link for npm will be (hard coding with working test case for now)
        owner = "browserify";
        repository = "browserify";
    }
    else {
        console.log("error");
    }
    // Non-API metric calculations
    var foundLicense = (0, License_1.getLicense)(urls[i], repository); // get the license for the repo
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var repoInfo, repoIssues, repoUsers, busFactor, correctness, rampUp, responsiveMaintainer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.default)(owner, repository)];
                case 1:
                    repoInfo = _a.sent();
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.fetchRepositoryIssues)(owner, repository)];
                case 2:
                    repoIssues = _a.sent();
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.fetchRepositoryUsers)(owner, repository)];
                case 3:
                    repoUsers = _a.sent();
                    busFactor = calculateBusFactorScore(repoUsers);
                    correctness = calculateCorrectness(repoIssues);
                    rampUp = calculateRampUpScore(repoUsers);
                    responsiveMaintainer = calculateResponsiveMaintainerScore(repoIssues);
                    // print out scores (for testing)
                    console.log('Bus Factor:  ', busFactor);
                    console.log('Correctness: ', correctness);
                    console.log('Ramp Up:     ', rampUp);
                    console.log('Responsive Maintainer: ', responsiveMaintainer);
                    console.log('License Found: ', foundLicense);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
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

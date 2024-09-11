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
var dotenv = require("dotenv");
dotenv.config();
var TOKEN = process.env.GITHUB_TOKEN;
var GITHUB_API_URL = 'https://api.github.com/graphql';
// GraphQL query to fetch GitHub repository data
var query = "\n  query {\n    repository(owner: \"ECE-461-Team-16\", name: \"ACME-Project\") {\n      name\n      owner {\n        login\n      }\n      forks {\n        totalCount\n      }\n      issues(last: 20) {\n        totalCount\n        edges {\n          node {\n            title\n            createdAt\n            closedAt\n          }\n        }\n      }\n      closedIssues: issues(states: CLOSED) {\n        totalCount\n      }\n      mentionableUsers(first: 100) {\n        edges {\n          node {\n            login\n            url\n            contributionsCollection {\n              contributionCalendar {\n                totalContributions\n              }\n              commitContributionsByRepository(maxRepositories: 1) {\n                contributions(first: 1, orderBy: { field: OCCURRED_AT, direction: ASC }) {\n                  edges {\n                    node {\n                      occurredAt\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }";
// Function to make API request using fetch
function fetchGitHubData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(GITHUB_API_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': "Bearer ".concat(TOKEN),
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: query }),
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch data: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Function to print repository details
function printRepositoryDetails(repo) {
    console.log('Repository:', repo.name);
    console.log('Owner:', repo.owner.login);
    console.log('Forks:', repo.forks.totalCount);
    console.log('Total Issues:', repo.issues.totalCount);
    console.log('Total Closed Issues:', repo.closedIssues.totalCount);
}
// Function to print issue details
function printIssueDetails(issues) {
    if (issues.edges && issues.edges.length > 0) {
        console.log('\nIssue Details:');
        issues.edges.forEach(function (issue, index) {
            console.log("\nIssue ".concat(index + 1, ":"));
            console.log("Title: ".concat(issue.node.title));
            console.log("Opened At: ".concat(issue.node.createdAt));
            console.log("Closed At: ".concat(issue.node.closedAt || 'Still open'));
        });
    }
    else {
        console.log('No issue details available.');
    }
}
// Function to print mentionable user details
function printMentionableUsers(users) {
    var totalContributions = 0;
    if (users.edges && users.edges.length > 0) {
        console.log('\nMentionable Users:');
        users.edges.forEach(function (user, index) {
            var _a, _b, _c, _d, _e, _f;
            var contributions = user.node.contributionsCollection.contributionCalendar.totalContributions;
            totalContributions += contributions;
            // Get the first contribution date, if available
            var firstContribution = ((_f = (_e = (_d = (_c = (_b = (_a = user.node.contributionsCollection.commitContributionsByRepository) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.contributions) === null || _c === void 0 ? void 0 : _c.edges) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.node) === null || _f === void 0 ? void 0 : _f.occurredAt) || 'No contributions';
            console.log("\nUser ".concat(index + 1, ":"));
            console.log("Username: ".concat(user.node.login));
            console.log("Profile URL: ".concat(user.node.url));
            console.log("Total Contributions: ".concat(contributions));
            console.log("First Contribution Date: ".concat(firstContribution));
        });
        console.log("\nTotal Contributions from All Mentionable Users: ".concat(totalContributions));
    }
    else {
        console.log('No mentionable users available.');
    }
}
// Fetch data and print the details using the functions
fetchGitHubData()
    .then(function (info) {
    var repo = info.data.repository;
    printRepositoryDetails(repo);
    printIssueDetails(repo.issues);
    printMentionableUsers(repo.mentionableUsers);
})
    .catch(function (error) {
    console.error('Error fetching GitHub data:', error);
});

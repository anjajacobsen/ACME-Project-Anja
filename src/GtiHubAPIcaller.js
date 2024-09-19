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
exports.default = fetchRepositoryInfo;
exports.fetchRepositoryIssues = fetchRepositoryIssues;
exports.fetchRepositoryUsers = fetchRepositoryUsers;
exports.getNpmPackageGithubRepo = getNpmPackageGithubRepo;
exports.printRepositoryInfo = printRepositoryInfo;
exports.printRepositoryIssues = printRepositoryIssues;
exports.printRepositoryUsers = printRepositoryUsers;
var dotenv = require("dotenv");
var axios_1 = require("axios");
// stuff to grab token from .env file
dotenv.config();
var TOKEN = process.env.GITHUB_TOKEN;
// GraphQl endpoint
var GITHUB_API_URL = 'https://api.github.com/graphql';
/////// GraphQL API calls for different information ///////
// function to call API for basic repo information
function fetchRepositoryInfo(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var query, response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n    query {\n      repository(owner: \"".concat(owner, "\", name: \"").concat(name, "\") {\n        name\n        owner {\n          login\n        }\n        forks {\n          totalCount\n        }\n      }\n    }\n  ");
                    return [4 /*yield*/, fetch(GITHUB_API_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(TOKEN),
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
// function to call API for issue repo information
function fetchRepositoryIssues(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var query, response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n  query {\n    repository(owner: \"".concat(owner, "\", name: \"").concat(name, "\") {\n        issues(last: 50) {\n            totalCount\n            edges {\n                node {\n                    title\n                    createdAt\n                    closedAt\n                }\n            }\n        }\n        closedIssues: issues(states: CLOSED) {\n          totalCount\n        }\n      }\n    }\n  ");
                    return [4 /*yield*/, fetch(GITHUB_API_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(TOKEN),
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
// function to call API for user repo information
function fetchRepositoryUsers(owner, name) {
    return __awaiter(this, void 0, void 0, function () {
        var query, response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n    query {\n      repository(owner: \"".concat(owner, "\", name: \"").concat(name, "\") {\n        mentionableUsers(first: 10) {\n          edges {\n            node {\n              login\n              url\n              contributionsCollection {\n                contributionCalendar {\n                  totalContributions\n                }\n                commitContributionsByRepository {\n                  contributions(first: 1) { \n                    edges {\n                      node {\n                        occurredAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  ");
                    return [4 /*yield*/, fetch(GITHUB_API_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(TOKEN),
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
/**
 * Fetches NPM package details from the NPM registry and extracts the GitHub repository URL.
 * @param packageName - The name of the NPM package to query.
 * @returns The GitHub repository URL if available, otherwise null.
 */
function getNpmPackageGithubRepo(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, packageData, repoUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://registry.npmjs.org/".concat(packageName))];
                case 1:
                    response = _a.sent();
                    packageData = response.data;
                    // Check if the repository field exists and is a GitHub repository
                    if (packageData.repository && packageData.repository.url) {
                        repoUrl = packageData.repository.url;
                        // console.log('***PACKAGE URL RETURN: ' + repoUrl);
                        // Convert SSH to HTTPS
                        if (repoUrl.startsWith('git+ssh://git@')) {
                            // Convert 'git@github.com:user/repo.git' to 'https://github.com/user/repo'
                            repoUrl = repoUrl.replace('git+ssh://git@', 'https://').replace('.git', '');
                        }
                        else if (repoUrl.startsWith('git+')) {
                            // Convert 'git@github.com:user/repo.git' to 'https://github.com/user/repo'
                            repoUrl = repoUrl.replace('git+', '').replace('.git', '');
                        }
                        // Check if the URL points to GitHub
                        if (repoUrl.includes('github.com')) {
                            // console.log('HERE IS THE URL HERE IS THE URL: ' + repoUrl);
                            return [2 /*return*/, repoUrl];
                        }
                    }
                    return [2 /*return*/, null]; // Return null if no valid GitHub repository is found
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to fetch NPM package data for ".concat(packageName, ":"), error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/////// print functions ///////
// print repository basic information
function printRepositoryInfo(info) {
    var repository = info.data.repository;
    console.log('Repository Name:', repository.name);
    console.log('Owner:', repository.owner.login);
    console.log('Forks:', repository.forks.totalCount);
}
// print repository issue information
function printRepositoryIssues(info) {
    var repository = info.data.repository;
    var issues = repository.issues;
    // details of each issue (for loop from GPT)
    issues.edges.forEach(function (issue, index) {
        console.log("Issue: ".concat(index + 1, ":"));
        console.log(' Title: ', issue.node.title);
        console.log('  Created At: ', issue.node.createdAt);
        console.log('  Closed At:  ', issue.node.closedAt ? issue.node.closedAt : 'Open');
    });
    // total closed issues
    console.log('Total Closed Issues:', repository.closedIssues.totalCount);
    // total Issues
    console.log('Total Issues:', issues.totalCount);
}
// print repository user information
function printRepositoryUsers(info) {
    var mentionableUsers = info.data.repository.mentionableUsers;
    // check if there are no users
    if (mentionableUsers.edges.length === 0) {
        console.log("No mentionable users found.");
        return;
    }
    // print out each user (for loop from GPT)
    mentionableUsers.edges.forEach(function (user, index) {
        if (!user.node) {
            console.log("User ".concat(index + 1, ": Data is unavailable"));
            return;
        }
        console.log("User ".concat(index + 1, ":"));
        console.log('  Login: ', user.node.login);
        console.log('  Profile URL: ', user.node.url);
        console.log('  Total Contributions: ', user.node.contributionsCollection.contributionCalendar.totalContributions);
        // print all user's first contribution
        if (user.node.contributionsCollection.commitContributionsByRepository.length > 0) {
            user.node.contributionsCollection.commitContributionsByRepository.forEach(function (repo, repoIndex) {
                console.log('  Repository ', repoIndex + 1, 'Contributions:');
                if (repo.contributions.edges.length > 0) {
                    repo.contributions.edges.forEach(function (contribution, contributionIndex) {
                        console.log("    Contribution ".concat(contributionIndex + 1, ":"));
                        console.log('      Occurred At: ', contribution.node.occurredAt);
                    });
                }
                else {
                    console.log("    No contributions found.");
                }
            });
        }
        else {
            console.log("      No repository contributions found.");
        }
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicense = getLicense;
function getLicense(url, repository) {
    var shell = require('shelljs');
    var path = './clonedGitRepos';
    shell.cd(path); // Change to the desired directory
    shell.exec("git clone ".concat(url), { silent: true }); //clone the repo
    // Use a regex to match any file that starts with "LICENSE"
    var foundLicense = shell.find("./".concat(repository)).filter(function (file) { return /LICENSE(\..*)?$/i.test(file); })[0];
    shell.exec("rm -r ".concat(repository));
    shell.cd('..');
    // Check if any license file was found
    if (foundLicense) {
        return 1;
    }
    else {
        return 0;
    }
}

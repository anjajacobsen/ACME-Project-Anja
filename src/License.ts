export function getLicense( url : string, repository : string ){
    const shell = require('shelljs');
    const path = './clonedGitRepos';

    shell.cd(path); // Change to the desired directory
    
    shell.exec(`git clone ${url}`, {silent : true}); //clone the repo
    
    // Use a regex to match any file that starts with "LICENSE"
    const foundLicense = shell.find(`./${repository}`).filter((file : string) => /LICENSE(\..*)?$/i.test(file))[0];
    shell.exec(`rm -r ${repository}`);
    shell.cd('..');

    // Check if any license file was found
    if (foundLicense) { return 1; } 
    else { return 0; }   
    
}



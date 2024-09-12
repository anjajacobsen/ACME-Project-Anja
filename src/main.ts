// import fetch/print functions and interfaces
import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues,
                              RepositoryInfo, RepositoryIssues, RepositoryUsers,
                              printRepositoryUsers, printRepositoryIssues, printRepositoryInfo 
                            } from './GtiHubAPIcaller';

const owner = 'ECE-461-Team-16';
const repository = 'ACME-Project';

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
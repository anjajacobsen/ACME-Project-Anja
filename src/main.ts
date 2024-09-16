// import fetch/print functions and interfaces
import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues,
                              RepositoryInfo, RepositoryIssues, RepositoryUsers,
                              printRepositoryUsers, printRepositoryIssues, printRepositoryInfo 
                            } from './GtiHubAPIcaller';


function calculateBusFactorScore(users: RepositoryUsers): number {
  // get total contributions for each user
  const contributions = users.data.repository.mentionableUsers.edges.map(
    (user) => user.node.contributionsCollection.contributionCalendar.totalContributions
  );

  // get total contributions by everyone
  const totalContributions = contributions.reduce((acc, val) => acc + val, 0);

  // total number users
  const totalUsers = contributions.length;

  // average contribution per person
  const averageContribution = totalContributions / totalUsers;

  // get number of users with contributions >= average contributions per person
  const aboveAverageContributors = contributions.filter(
    (contribution) => contribution >= averageContribution
  ).length;

  const busFactorScore = aboveAverageContributors / totalUsers;

  // round to the nearest hundredth
  return Math.round(busFactorScore * 100) / 100;
}

function calculateCorrectness(issues: RepositoryIssues): number {
  const totalIssues = issues.data.repository.issues.totalCount;
  const completedIssues = issues.data.repository.closedIssues.totalCount;

  if(totalIssues === 0) {
    return 1;
  }

  const correctness = completedIssues / totalIssues;

  // round to the nearest hundredth
  return Math.round(correctness * 100) / 100;
}

function calculateRampUpScore(users: RepositoryUsers): number {
  // get first contribution date for each user (from ChatGPT)
  const firstContributionDates: number[] = users.data.repository.mentionableUsers.edges
    .map((user) => {
      const contributionDates = user.node.contributionsCollection.commitContributionsByRepository.flatMap((repo) =>
        repo.contributions.edges.map((contribution) => new Date(contribution.node.occurredAt).getTime())
      );
      return contributionDates.length ? Math.min(...contributionDates) : null;
    })
    .filter((date) => date !== null) as number[];

  // if no valid contribution dates, return 0 as the score.
  // need at least two contributors to calculate the average
  if(firstContributionDates.length < 2) {    
    return 0;
  }

  // find the time differences between contributors (in weeks) 
  const timeDifferences: number[] = [];
  for (let i = 1; i < firstContributionDates.length; i++) {
    const diffInWeeks = (firstContributionDates[i] - firstContributionDates[i - 1]) / (1000 * 3600 * 24 * 7);
    timeDifferences.push(diffInWeeks);
  }

  // find average (in weeks)
  const averageTimeDifference = timeDifferences.reduce((acc, val) => acc + val, 0) / timeDifferences.length;

  const rampUpScore = 1 / averageTimeDifference;

  // round to the nearest hundredth
  return Math.round(rampUpScore * 100) / 100;
}

function calculateResponsiveMaintainerScore(issues: RepositoryIssues): number {
  // get date one month ago from today
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1); // set for one month ago

  // get issue creation and closed dates from past month (from ChatGPT)
  const recentIssues = issues.data.repository.issues.edges.filter((issue) => {
    const createdAt = new Date(issue.node.createdAt);
    return createdAt >= oneMonthAgo;
  });

  // get total number of issues created within the past month
  const totalIssues = recentIssues.length;

  // get number of resolved issues within the past month
  const resolvedIssues = recentIssues.filter((issue) => issue.node.closedAt !== null).length;

  // if no issues were created in the past month
  if(totalIssues === 0) {
    return 0;
  }

  const responsiveMaintainer = resolvedIssues / totalIssues;

  // round to the nearest hundredth
  return Math.round(responsiveMaintainer * 100) / 100;
}


/////////////// FOR TESTING //////////////

const owner = 'ECE-461-Team-16'; 
const repository = 'ACME-Project';

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

(async () => {
  try {
    // get inferfaces to get all metrics for repository information
    const repoInfo:   RepositoryInfo   = await fetchRepositoryInfo(owner, repository);
    const repoIssues: RepositoryIssues = await fetchRepositoryIssues(owner, repository);
    const repoUsers:  RepositoryUsers  = await fetchRepositoryUsers(owner, repository);

    // print information (not required for project; for testing purposes)
    // printRepositoryInfo(repoInfo);
    // printRepositoryIssues(repoIssues);
    // printRepositoryUsers(repoUsers);

    // call metric calculations
    const busFactor           = calculateBusFactorScore(repoUsers);
    const correctness         = calculateCorrectness(repoIssues);
    const rampUp              = calculateRampUpScore(repoUsers);
    const responveiMaintainer = calculateResponsiveMaintainerScore(repoIssues);

    // print out scores (for testing)
    console.log('Bus Factor:  ', busFactor);
    console.log('Correctness: ', correctness);
    console.log('Ramp Up:     ', rampUp);
    console.log('Responsive Maintainer: ', responveiMaintainer);
} 
catch (error) {
  console.error('Error:', error); 
}
})();



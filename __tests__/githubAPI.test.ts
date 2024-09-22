import { processPackageData } from '../src/main';

jest.mock('../src/GitHubAPIcaller', () => ({
  getNpmPackageGithubRepo: jest.fn()
}));

describe('NPM Package Processing', () => {
  // Mock process.exit to prevent it from stopping Jest tests
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
    console.log(`process.exit(${code}) called`);
  });

  afterAll(() => {
    mockExit.mockRestore(); // Restore the original implementation after tests
  });

  it('should return the GitHub repository URL for a given NPM package', async () => {
    const { getNpmPackageGithubRepo } = require('../src/GitHubAPIcaller');
    getNpmPackageGithubRepo.mockResolvedValue('https://github.com/owner/repository');

    const result = await processPackageData('test-package');
    expect(result).toBe('https://github.com/owner/repository');
  });

  it('should handle no GitHub repository found for an NPM package', async () => {
    const { getNpmPackageGithubRepo } = require('../src/GitHubAPIcaller');
    getNpmPackageGithubRepo.mockResolvedValue(null);

    const result = await processPackageData('test-package');
    expect(result).toBe('');
  });
});

import * as fs from 'fs';
import { processPackageData } from '../src/main';

// Mock fs.readFileSync
jest.mock('fs');

describe('File and URL Reading Tests', () => {
  beforeEach(() => {
    // Reset any mocked functions
    jest.clearAllMocks();
  });

  it('should read URLs from file and split them correctly', () => {
    const mockData = 'https://github.com/owner/repository\nhttps://www.npmjs.com/package/test-package';
    (fs.readFileSync as jest.Mock).mockReturnValue(mockData);

    const inputFilePath = 'test.txt';
    const urlFile = fs.readFileSync(inputFilePath, 'utf-8');
    const urls = urlFile.split('\n');

    expect(fs.readFileSync).toHaveBeenCalledWith(inputFilePath, 'utf-8');
    expect(urls).toEqual([
      'https://github.com/owner/repository',
      'https://www.npmjs.com/package/test-package',
    ]);
  });
});

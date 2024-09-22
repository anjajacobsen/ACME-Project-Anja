

import { validateFilePath, validateFileContent } from '../src/main';
import logger from '../src/logger';

jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`process.exit called with ${code}`);
  });
  

jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

test('Non-valid file path', () => {
  const invalidFilePath = 'invalidPath.xyz';
  expect(() => validateFilePath(invalidFilePath)).toThrowError('Invalid file path: invalidPath.xyz');
});

test('File path is wrong type (not .txt)', () => {
  const invalidFilePath = 'file.doc';  // Invalid file extension
  expect(() => validateFilePath(invalidFilePath)).toThrowError('Only .txt files are allowed: file.doc');
});

test('TXT file contains things other than GitHub or NPM URLs', () => {
  const fileContent = `
    https://github.com/some/repo
    https://www.example.com  // Invalid URL
  `;
  const urls = fileContent.split('\n').map(url => url.trim());
  expect(() => validateFileContent(urls)).toThrowError('File contains invalid URLs: https://www.example.com');
});

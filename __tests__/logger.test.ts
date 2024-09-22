// __tests__/logger.test.ts
import * as winston from 'winston';

describe('Logger', () => {
  let spyConsole: jest.SpyInstance;
  let spyFile: jest.SpyInstance;

  beforeEach(() => {
    // Mock the transports
    spyConsole = jest.spyOn(winston.transports.Console.prototype, 'log').mockImplementation(() => {});
    spyFile = jest.spyOn(winston.transports.File.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules(); // This is important to reset modules when testing environment variables
  });

  it('should log to console and file at the "info" level by default', () => {
    const logger = require('../src/logger').default; // Re-require the logger

    logger.info('Info log message');
    expect(spyConsole).toHaveBeenCalled();
    expect(spyFile).toHaveBeenCalled();
  });

  it('should respect LOG_LEVEL environment variable', () => {
    process.env.LOG_LEVEL = 'error'; // Set environment variable
    const logger = require('../src/logger').default; // Re-require logger to pick up new env

    logger.info('This should not be logged');
    logger.error('This should be logged');

    expect(spyConsole).toHaveBeenCalledTimes(1); // Only error should be logged
    expect(spyFile).toHaveBeenCalledTimes(1);

    delete process.env.LOG_LEVEL;
  });

  it('should respect LOG_FILE environment variable', () => {
    process.env.LOG_FILE = './custom.log'; // Set custom log file path
    const logger = require('../src/logger').default; // Re-require logger

    logger.info('Log message to custom file');
    expect(spyFile).toHaveBeenCalled(); // The file transport should have been called

    delete process.env.LOG_FILE;
  });

  it('should use default log level and file when environment variables are not set', () => {
    const logger = require('../src/logger').default; // Re-require default logger without env vars

    logger.info('This is a default log');
    expect(spyConsole).toHaveBeenCalled();
    expect(spyFile).toHaveBeenCalled();
  });
  it('should format logs correctly', () => {
    const mockLog = jest.fn();
    spyConsole.mockImplementation(mockLog);
  
    const logger = require('../src/logger').default; // Re-require the logger
  
    const logMessage = 'Test message';
    logger.info(logMessage); // Log an info message
  
    // The mockLog should have been called with an object, we now assert on that
    const loggedObject = mockLog.mock.calls[0][0]; // Get the first call to mockLog
  
    // Expect the object to have specific properties
    expect(loggedObject).toMatchObject({
      level: 'info',
      message: 'Test message',
      timestamp: expect.any(String), // You can further check if needed
    });
  });
});

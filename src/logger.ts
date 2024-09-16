import winston from 'winston';

// Get log level from environment variable (default to 'info')
const logLevel = process.env.LOG_LEVEL || 'info';

// Get log file path from environment variable (default to './app.log')
const logFile = process.env.LOG_FILE || './app.log';

// Create a Winston logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFile }),
    new winston.transports.Console() // Optional: Log to console as well
  ]
});

export default logger;

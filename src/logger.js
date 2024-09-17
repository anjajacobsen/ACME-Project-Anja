"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
// Get log level from environment variable (default to 'info')
var logLevel = process.env.LOG_LEVEL || 'info';
// Get log file path from environment variable (default to './app.log')
var logFile = process.env.LOG_FILE || './app.log';
// Create a Winston logger instance
var logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.printf(function (_a) {
        var timestamp = _a.timestamp, level = _a.level, message = _a.message;
        return "".concat(timestamp, " [").concat(level.toUpperCase(), "] ").concat(message);
    })),
    transports: [
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console() // Delete if we don't want console output
    ]
});
exports.default = logger;

import winston from "winston";

// Create a Winston logger instance with custom settings

const logger = winston.createLogger({
  // Set the minimum level to log (can be changed based on environment)
  level: "info",
  // Define the log message format (timestamp + pretty print)
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ""
      }`;
    })
  ),
  // Default metadata for all logs
  defaultMeta: { service: "user-service" },
  // Define where to write logs
  transports: [
    // Log errors to error.log
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // Log all info and above to combined.log
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If not in production, also log to the console with colorized output
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Export the logger to use in other files
export default logger;

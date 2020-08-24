// logger

import * as winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

// log levels
export enum LOG_LEVEL {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

const logger = winston.createLogger({
  defaultMeta: { service: "Task-Service" },
  format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json()),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV == "prod") {
  logger.add(
    new winstonDailyRotateFile({
      level: LOG_LEVEL.INFO,
      datePattern: "YYYY-MM-DD",
      filename: process.env.LOG_FILE_NAME || "task-service-%DATE%.log",
      dirname: process.env.LOG_FILE_DIR || ".",
    })
  );
}

export const log = (severity: LOG_LEVEL = LOG_LEVEL.INFO, logMessage: any, error?: any) => {
  const errorDetails = error ? { error: { message: error.message, stack: error.stack, name: error.name } } : {};

  logger.log({
    level: severity,
    message: logMessage,
    ...errorDetails,
  });
};

// logger

import * as winston from 'winston';
import { MongoDB } from 'winston-mongodb';
import config from '../config';

// log levels
export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === 'prod') {
  const mongoLogger = new MongoDB({
    level: LOG_LEVEL.INFO,
    label: config.serviceName,
    collection: `${config.serviceName}-log`,
    db: config.logs.connectionStringLogs,
    expireAfterSeconds: config.logs.expiredInSec,
    tryReconnect: false,
  });

  logger.add(mongoLogger);
}
export const log = (severity: string, message: any, error?: any) => {
  const errorDetails = error
    ? { error: { message: error.message, stack: error.stack, name: error.name } }
    : {};

  logger.log({ level: severity, message, ...errorDetails });
};

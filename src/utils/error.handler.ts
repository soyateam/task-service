// error.handler

import { Request, Response, NextFunction } from 'express';
import { MongooseErrorHandler } from './error.handler.mongoose';
import { BaseError } from './error';
import { log, LOG_LEVEL } from './logger';

// TODO: Error type correction
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {

  if (error instanceof BaseError) {

    log(LOG_LEVEL.WARN, { status: error.status }, error);

    return res.status(error.status).send({ message: error.message });
  }

  if (MongooseErrorHandler.instanceOf(error)) {
    const parsedError = MongooseErrorHandler.parseError(error);

    log(LOG_LEVEL.WARN, { status: parsedError.status }, parsedError);

    return res.status(parsedError.status).send({ message: parsedError.message });
  }

  log(LOG_LEVEL.ERROR, { status: error.status }, error);

  // Other errors
  return res.status(error.status || 500)
            .send({ message: error.message || 'Internal Server Error' });
}

// error.handler

import { Request, Response, NextFunction } from 'express';
import { BaseError } from './error';

// TODO: Error type correction
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {

  if (error instanceof BaseError) {
    return res.status(error.status).send({ message: error.message });
  }

  // Other errors
  return res.status(error.status || 500)
            .send({ message: error.message || 'Internal Server Error' });
}

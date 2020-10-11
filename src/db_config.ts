// db_config

import mongoose from 'mongoose';
import config from './config';
import { log, LOG_LEVEL } from './utils/logger';

export const connectToMongo = async () => {
  log(LOG_LEVEL.INFO, `[MongoDB] trying to mongo server:  ${config.mongoUrl}`);
  try {
    await mongoose.connect(config.mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (err) {
    log(LOG_LEVEL.ERROR, `did not connect to ${config.mongoUrl}. error: ${err}`, err);
    return;
  }

  log(LOG_LEVEL.INFO, `successfully connected: ${config.mongoUrl}`);
};

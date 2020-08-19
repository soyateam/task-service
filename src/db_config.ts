// db_config

import mongoose from "mongoose";
import config from "./config";
import { log, LOG_LEVEL } from "./utils/logger";

mongoose.connect(
  config.mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      log(LOG_LEVEL.ERROR, "Error connnecting to mongoose", err);
      process.exit();
    }
    log(LOG_LEVEL.INFO, "MongoDB Connection Established");
  }
);

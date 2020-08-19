// server

import * as http from "http";
import app from "./app";
import { log, LOG_LEVEL } from "./utils/logger";

http.createServer(app).listen(app.get("port"), () => {
  const logMessage = `Authorization Server is running at port ${app.get("port")} in ${app.get("env")} mode`;
  log(LOG_LEVEL.DEBUG, logMessage);

  console.log("Press CTRL-C to stop\n");
});

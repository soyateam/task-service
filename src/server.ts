// server

import * as http from 'http';
import app from './app';
import { connectToMongo } from './db_config';

(async () => {
  await connectToMongo();

  http.createServer(app).listen(app.get('port'), () => {
    const logMessage = `task service is running at port ${app.get('port')} in ${app.get(
      'env'
    )} mode`;

    console.log(logMessage);
    console.log('Press CTRL-C to stop\n');
  });
})();

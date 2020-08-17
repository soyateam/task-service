// config

const config = {
  // MongoDB Url
  mongoUrl:
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.MONGO_URL}`,

  /* Routes Configuration */

  // Task Routes
  TASK_ENDPOINT: 'task',
  TASK_PARENT_ENDPOINT: 'parent',
  TASK_TYPE_ENDPOINT: 'type',

};

export default config;

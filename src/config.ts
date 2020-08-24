// config

const config = {
  // MongoDB Url
  mongoUrl:
    `mongodb://${process.env.MONGO_CONNECTION_STRING}/${process.env.TASK_DB_NAME}`,

  /* Routes Configuration */

  // Task Routes
  TASK_ENDPOINT: 'task',
  TASK_PARENT_ENDPOINT: 'parent',
  TASK_TYPE_ENDPOINT: 'type',
  TASK_CHILDREN_ENDPOINT: 'children',

};

export default config;

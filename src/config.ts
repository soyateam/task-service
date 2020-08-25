// config

const config = {
  // MongoDB Url
  mongoUrl: process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017',

  /* Routes Configuration */

  // Task Routes
  TASK_ENDPOINT: 'task',
  TASK_PARENT_ENDPOINT: 'parent',
  TASK_TYPE_ENDPOINT: 'type',
  TASK_CHILDREN_ENDPOINT: 'children',
  cors: {
    allowedOrigin: process.env.ALLOWED_ORIGIN || '*',
  },
};

export default config;

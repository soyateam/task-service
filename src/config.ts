// config

const config = {
  serviceName: 'task-service',

  // MongoDB Url
  mongoUrl: process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017',

  logs: {
    connectionStringLogs: process.env.MONGO_CONNECTION_STRING_LOGS || 'mongodb://mongo:27017/logs',
    expiredInSec: 2592000, // 30 days
  },
  /* Routes Configuration */

  // Task Routes
  TASK_ENDPOINT: 'task',
  TASK_PARENT_ENDPOINT: 'parent',
  TASK_TYPE_ENDPOINT: 'type',
  TASK_CHILDREN_ENDPOINT: 'children',
};

export default config;

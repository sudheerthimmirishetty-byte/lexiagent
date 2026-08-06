const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 LexiAgent AI Server listening on port ${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();

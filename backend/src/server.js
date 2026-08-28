require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});

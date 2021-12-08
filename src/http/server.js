const { connectDB } = require('../db/connect');
const app = require('./app');

const config = require('../config');

const port = config.server.port || 3000;

const start = async () => {
  try {
    await connectDB(config.database.uri)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

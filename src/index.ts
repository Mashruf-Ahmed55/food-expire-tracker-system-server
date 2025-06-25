import 'dotenv/config';
import app from './app.js';
import { connectDb } from './db/connectdb.js';

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

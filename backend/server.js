import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const currentFile = path.resolve(__filename);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isDirectRun = invokedFile === currentFile;

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`LAPTOPIA Backend running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

if (isDirectRun) {
  startServer();
}

export { startServer };


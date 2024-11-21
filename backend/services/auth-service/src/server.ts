import app from './app';
import dotenv from 'dotenv';
import { config } from './config';

dotenv.config();

const startServer = async () => {
  try {
    const port = config.PORT || 3001;
    app.listen(port, () => {
      console.log(`Auth service running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from './utils/getEnvVar.js';

import { createTables } from './db/createTables.js';
import { testConnection } from './db/testDbConnection.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOADS_DIR } from './constants/index.js';

const app = express();
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = async () => {
  try {
		await testConnection();
		console.log('SQLDB connection established successfully!');

		await createTables();

    app.use(
      cors({
        origin: [
          'http://localhost:5173',
          'https://money-guard-team-project-nine.vercel.app',
        ],
        credentials: true,
      }),
    );
    app.use(express.json());
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.use('/api-docs', swaggerDocs());
    app.use(cookieParser());
    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );

    app.use(router);

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server setup:', error);
  }
};

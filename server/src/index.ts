import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import kairosRoutes from './routes/kairosRoutes';
import cors, { CorsOptions } from 'cors';
import https from 'https';
import fs from 'fs';

const app: Express = express();
const port = process.env.PORT || 8000;

// Allow requests from specific origins
const allowedOrigins: string[] = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://localhost:5173',
  'https://192.168.1.2:5174'
];

if (process.env.SERVER_URL) {
  allowedOrigins.push(process.env.SERVER_URL);
}

// Define CORS options
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      // Allow requests from the whitelist or requests with no origin (e.g., same-origin requests)
      callback(null, true);
    } else {
      // Block requests from other origins
      callback(new Error('Not allowed by CORS'), false);
    }
  },
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Error handler middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(500).send('Internal Server Error');
  } else {
    next(err);
  }
});

app.use(express.json({ limit: '50mb' }));

app.use('/api/kairos', kairosRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('FRS Server is running !');
});

if (process.env.USE_HTTPS === 'true') {
  let options;
  if (process.env.ENV === 'prod') {
    options = {
      cert: fs.readFileSync(`${process.env.CERT_PATH}`),
      key: fs.readFileSync(`${process.env.KEY_PATH}`),
    };
  } else {
    options = {
      cert: fs.readFileSync(__dirname + '/certs/localhost.pem'),
      key: fs.readFileSync(__dirname + '/certs/localhost-key.pem'),
    };
  }
  const server = https.createServer(options, app);
  server.listen(port, () => {
    console.log(`Express server running over HTTPS on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Express server running over HTTP on port ${port}`);
  });
}
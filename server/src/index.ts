import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import kairosRoutes from './routes/kairosRoutes';
import cors, { CorsOptions } from 'cors';

const app: Express = express();
const port = process.env.PORT;

// Allow requests from specific origins
const allowedOrigins: string[] = ['http://127.0.0.1:5173', 'http://localhost:5173'];

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

app.use(express.json());


app.use('/api/kairos', kairosRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('FRS Server is running !');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { registerUserRoutes } from './routes/users';

dotenv.config();

const app = Fastify({ logger: true });

async function registerPlugins() {
  // CORS configuration for development
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests from localhost in development
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001', // Allow same origin
      ];

      // In development, allow any localhost origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        cb(null, true);
        return;
      }

      // Check against allowed origins list
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }

      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type'],
    maxAge: 86400, // 24 hours
  });
}

async function registerRoutes() {
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'agent-service',
      timestamp: Date.now(),
    };
  });

  // Register user routes
  await registerUserRoutes(app);
}

async function start() {
  await registerPlugins();
  await registerRoutes();

  const port = Number(process.env.PORT ?? 3001);
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
    app.log.info(`Agent service listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

// Placeholder for agent service entry point
console.log('Agent Service - Ready for development');

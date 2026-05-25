import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';

export const connection = new Redis(REDIS_URI, {
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  console.log('Successfully connected to Redis.');
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

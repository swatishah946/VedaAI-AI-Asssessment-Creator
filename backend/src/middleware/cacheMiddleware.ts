import { Request, Response, NextFunction } from 'express';
import { connection as redisClient } from '../queue/connection';

export const cacheMiddleware = (keyPrefix: string, expireSeconds: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    const cacheKey = `${keyPrefix}_${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        // Return cached response instantly
        res.status(200).json(JSON.parse(cachedData));
        return;
      }

      // Intercept res.json to cache the outgoing data
      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        // Cache the body before sending it out
        redisClient.setex(cacheKey, expireSeconds, JSON.stringify(body))
          .catch(err => console.error('Redis cache error:', err));
        
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const clearCache = async (keyPrefix: string) => {
  try {
    const keys = await redisClient.keys(`${keyPrefix}_*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

async function connectRedis() {
  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis', // Ensure correct Redis host in Docker
        port: 6379,
      },
    });

    await redisClient.connect().catch((err) => {
      console.error('❌ Redis connection failed:', err);
    });

    console.log('✅ Connected to Redis');
  }

  return redisClient;
}

// Do NOT use `await` at the top level!
export { redisClient, connectRedis };

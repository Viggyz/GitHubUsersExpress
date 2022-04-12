import { createClient } from 'redis';

const redisClient = createClient();

export { redisClient }
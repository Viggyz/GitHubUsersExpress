import { createClient } from 'redis';

const url = process.env.URL || "127.0.0.1";
const port = process.env.PORT || 6379;

const redisClient = createClient({ url: `redis://${url}:${port}` });

export { redisClient }
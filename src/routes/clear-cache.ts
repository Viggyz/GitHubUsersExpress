import express, { Request, Response } from 'express';

import { redisClient } from '../make-client';
import { CacheConnectionError } from '../middlewares/cache-connection-error';

const router = express.Router();

router.post(
    "/api/clear-cache",
    async (req: Request, res: Response) => {
        try {
            await redisClient.flushAll();
        }
        catch {
            throw new CacheConnectionError();
        }
        res.send({ message: "Cache Cleared" });
    });

export { router as clearCacheRouter }
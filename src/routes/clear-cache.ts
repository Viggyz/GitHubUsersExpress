import express, {Request, Response } from 'express';

const router = express.Router();

router.post(
    "/api/clear-cache",
    async( req: Request, res: Response) => {
        res.send({message: "cache route"})
    });

export { router as clearCacheRouter}
import express, {Request, Response } from 'express';

const router = express.Router();

router.post(
    "/api/search",
    async( req: Request, res: Response) => {
        res.send({message: "search route"})
    });

export { router as searchRouter}
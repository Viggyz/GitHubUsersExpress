import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';

import { RequestValidationError } from '../middlewares/request-validation-error';
import { CacheConnectionError } from '../middlewares/cache-connection-error';
import { redisClient } from '../make-client';
import { pushSearchOptions } from '@node-redis/search/dist/commands';

const router = express.Router();

interface UpdatedUser {
    username: string;
    id: number;
    avatar_url: string;
    profile_url: string;
}

router.post(
    "/api/search",
    [
        body("type").equals("users").withMessage("Must be of type 'users'"),
        body("text").trim().isLength({ min: 3, max: 39 }).withMessage("Search Text must a string between 3 and 39 characters")
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        try {
            const val = await redisClient.get(req.body.text)
            let updatedUsers: [UpdatedUser];
            if (val == null) {
                const users = await axios.get('http://api.github.com/search/users', {
                    params: { //Make this env
                        q: req.body.text,
                    }
                });
                if (users.data.items) {
                    updatedUsers = users.data.items.map((user: any) => {
                        return { username: user.login, car: "hi", id: user.id, avatar_url: user.avatar_url, profile_url: user.url }
                    });

                    await redisClient.setEx(req.body.text, parseInt(process.env.CACHE_DURATION!), JSON.stringify(updatedUsers));
                }
                else {
                    throw new Error("Invalid API Query")
                }

            }
            else {
                updatedUsers = JSON.parse(val);
            }

            res.send({ users: updatedUsers })
        }
        catch {
            throw new CacheConnectionError();
        }

    });

export { router as searchRouter }
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { RateLimitExceededError } from '../errors/rate-limit-error-exceeded-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { CacheConnectionError } from '../errors/cache-connection-error';
import { redisClient } from '../make-client';

interface UserProps {
    username: string;
    id: number,
    avatar_url: string,
    profile_url: string;
}

const router = express.Router();

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
            const users = await redisClient.get(req.body.text)
            let updatedUsers: UserProps[];

            if (users == null) {
                let users: AxiosResponse = await axios.get('http://api.github.com/search/users', {
                    params: { //Make this env
                        q: req.body.text,
                    }
                });
                if (users.status === 200) {
                    updatedUsers = users.data.items.map((user: any) => {
                        return { username: user.login, id: user.id, avatar_url: user.avatar_url, profile_url: user.html_url }
                    });
                    updatedUsers = updatedUsers.slice(0, 15);
                    // Increase Rate limit
                    // Write unit tests
                    await redisClient.setEx(req.body.text, parseInt(process.env.CACHE_DURATION!), JSON.stringify(updatedUsers));

                }
                else {
                    throw new Error();
                }

            }
            else {
                updatedUsers = JSON.parse(users);
            }

            res.send({ users: updatedUsers })
        }
        catch (err: AxiosError | any) {
            if (axios.isAxiosError(err) && err.response!.status === 403) {
                throw new RateLimitExceededError();
            }

            throw new CacheConnectionError();
        }

    });

export { router as searchRouter }
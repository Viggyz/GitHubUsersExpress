import express from 'express';
import "express-async-errors"; //Necessary for custom errors
import { json } from 'body-parser';

import { NotFoundError } from './middlewares/not-found-error';
import { errorHandler } from './middlewares/error-handler'

import { searchRouter } from './routes/search';
import { clearCacheRouter } from './routes/clear-cache';

const app = express();
app.use(json());

app.use(searchRouter);
app.use(clearCacheRouter);

app.all("*", async (req, res) => {
  console.log("Nope")
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
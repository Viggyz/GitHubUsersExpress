import express from 'express';
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
    throw new NotFoundError();
  });

app.use(errorHandler);


app.listen(8000, () => {
    console.log('App listening on 8000');
})
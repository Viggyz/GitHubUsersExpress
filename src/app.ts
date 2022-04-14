import express from 'express';
import "express-async-errors"; //Necessary for custom errors
import { json } from 'body-parser';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler'

import { searchRouter } from './routes/search';
import { clearCacheRouter } from './routes/clear-cache';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
const swaggerDocument = require('./swagger.json');
import path from 'path'

const app = express();

app.use(express.static(path.join(__dirname, "..", "..", '/client/build')))

app.use(json());
app.use(cors())
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(searchRouter);
app.use(clearCacheRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
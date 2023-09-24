import express from 'express';
import logger from 'morgan';
import compression from 'compression'

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;

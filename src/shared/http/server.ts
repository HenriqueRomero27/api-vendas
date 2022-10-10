import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from'./routes/index';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm/index';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errors());

app.use((req: Request, res: Response, err: Error, next: NextFunction) => {
  if(err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

app.listen(3333, () => {
  console.log("Server Started on port http://localhost:3333");
})

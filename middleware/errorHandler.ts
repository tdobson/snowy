module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
};
import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: boolean;
  error: string;
  stack?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const response: ErrorResponse = {
    success: false,
    error: err.message || 'Server Error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;

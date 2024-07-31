module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
};
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
};

export default errorHandler;

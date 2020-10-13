/**
 * Error handler.
 */
import { Request, Response, NextFunction } from 'express';

import L from '../../common/logger';

// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  err,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  L.error(err);
  next(err);
  const errors = err.errors || [{ message: err.message }];
  res.status(err.status || 500).json({ errors });
}

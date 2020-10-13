/**
 * Application-wide router.
 */
import { Application } from 'express';

import vehicleRouter from './api/controllers/vehicle/router';

export default function routes(app: Application): void {
  app.use('/api/v1/vehicle', vehicleRouter);
}

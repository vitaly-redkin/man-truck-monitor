/**
 * Routes for the vehicle end points.
 */
import express from 'express';

import controller from './controller';

export default express
  .Router()
  .get('/', controller.list)
  .get('/:id', controller.byId);

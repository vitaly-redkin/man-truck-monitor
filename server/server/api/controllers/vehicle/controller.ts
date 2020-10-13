import { Request, Response } from 'express';

import VehicleService from '../../services/vehicle.service';

/**
 * Controller for the vehicle end points.
 */
export class Controller {
  /**
   * Retuns the list of "registered" vehicles.
   *
   * @param req request to handle
   * @param res response to provide
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const r = await VehicleService.list();
      res.status(200).json(r);
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  }

  /**
   * Returns the N last positions of the vehicle with the given ID.
   *
   * @param req request to handle
   * @param res response to provide
   */
  async byId(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params['id']);
    const stepNo = Number.parseInt(req.query.step_no as string);
    try {
      const r = await VehicleService.byId(id, stepNo);
      if (r.length) {
        res.status(200).json(r);
      } else {
        res.status(404).end();
      }
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  }
}

export default new Controller();

import { VehicleModel } from '../../models/VehicleModel';
import { VehiclePositionModel } from '../../models/VehiclePositionModel';
import { getVehicles, getVehicleRoute } from '../../db';
import L from '../../common/logger';

/**
 * Service class.
 */
export class VehicleService {
  /**
   * Returns all "registered" vehicles.
   */
  async list(): Promise<VehicleModel[]> {
    L.info(`Fetch all vehicles`);
    return await getVehicles();
  }

  /**
   * Returns the stepNo last positions of the vehicle with the given ID.
   *
   * @param id ID of the vehicle to return the data for
   * @param stepNo the number of the last positions to return
   */
  async byId(id: number, stepNo: number): Promise<VehiclePositionModel[]> {
    L.info(`Fetch vehicle with ID=${id}`);
    return await getVehicleRoute(id, stepNo);
  }
}

export default new VehicleService();

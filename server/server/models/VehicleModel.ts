/**
 * Model for the vehicle object .
 */
export class VehicleModel {
  /**
   * Constructor.
   *
   * @param id ID of the vehicle
   * @param licensePlate vehicle license plate number
   * @param lat vehicle position lattitude
   * @param lat vehicle position longitude
   */
  constructor(
    public readonly id: number,
    public readonly licensePlate: string,
    public readonly lat?: number,
    public readonly lng?: number
  ) {}
}

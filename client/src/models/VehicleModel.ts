/**
 * Model for the vehicle object .
 */
export class VehicleModel {
  /**
   * Constructor.
   *
   * @param id ID of the vehicle
   * @param licensePlate vehicle license plate number
   */
  constructor(
    public readonly id: number,
    public readonly licensePlate: string,
  ) {}
}

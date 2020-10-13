/**
 * Model for the vehicle position object .
 */
export class VehiclePositionModel {
  /**
   * Constructor.
   *
   * @param id ID of the vehicle position
   * @param vehicleId ID of the vehicle
   * @param recordedAt the date/time position was recored at (in ISO format)
   * @param lat vehicle position lattitude
   * @param lat vehicle position longitude
   */
  constructor(
    public readonly id: number,
    public readonly vehicleId: number,
    public readonly recordedAt: string,
    public readonly lat: number,
    public readonly lng: number
  ) {}
}

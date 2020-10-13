
/**
 * Enum for POI types.
 */
export enum PoiTypeEnum {
  All = 0,
  GasStation = 1,
  Restaurant = 2,
  Hotel = 3,
  CurrentPosition = 100,
  FirstPosition = 101,
  Path = 102,
}

/**
 * Model for the Google Maps POI.
 */
export class PoiModel {
  /**
   * Constructor.
   * 
   * @param id POI ID
   * @param name POI name
   * @param type POI type
   * @param lat POI latititude
   * @param lng POI lontitude
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: PoiTypeEnum,
    public readonly lat: number,
    public readonly lng: number,
  ) {
  }
}

/**
 * Model for the value/label object used to hold dropdown options.
 */
export class ValueLabelModel {
  /**
   * Constructor.
   * 
   * @param value option value
   * @param label option label
   */
  constructor(
    public readonly value: number,
    public readonly label: string,
  ) {
  }
}

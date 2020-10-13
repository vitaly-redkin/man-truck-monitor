import { BaseService, EmptyPayload, SuccessHandler, ErrorHandler } from './BaseService';
import { VehicleModel } from '../models/VehicleModel';
import { VehiclePositionModel } from '../models/VehiclePositionModel';

/**
 * Vehicle endpoints common prefix.
 */
const PREFIX = '/vehicle'

/**
 * Class to make vehicle API calls.
 */
export class VehicleService extends BaseService {
    /**
     * Fetches all "registered" vehicles.
     * 
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public fetchVehicles(
        onSuccess: SuccessHandler<VehicleModel[]>,
        onError: ErrorHandler
    ): void {
        this.callApi<EmptyPayload, VehicleModel[]>(
            `${PREFIX}`,
            'GET',
            null,
            onSuccess,
            onError
        );
    }

    /**
     * Fetches the stepNo last positions of the vehicle with the given ID.
     * 
     * @param id ID of the vehicle to return the data for
     * @param stepNo the number of last vehicle positions to return
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public fetchVehicleRoute(
        id: number,
        stepNo: number,
        onSuccess: SuccessHandler<VehiclePositionModel[]>,
        onError: ErrorHandler
    ): void {
        this.callApi<EmptyPayload, VehiclePositionModel[]>(
            `${PREFIX}/${id}?step_no=${stepNo}`,
            'GET',
            null,
            onSuccess,
            onError
        );
    }
}

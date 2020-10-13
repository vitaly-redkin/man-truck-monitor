/** 
 * Base API calls service class.
 */

/**
 * Class with API error information.
 */
export class ServiceError {
    /**
     * Constructor.
     * 
     * @param message error message
     * @param expected true if error is expected one or false otherwise
     */
    public constructor(
        public readonly message: string,
        public readonly expected: boolean = false
    ) {
    }

    /**
     * Message to show to the user.
     */
    public get userMessage(): string {
        return (this.expected ? this.message : 'Server error occurred. Please try again later.');
    }
}

/**
 * Type for the API call success handlers.
 */
export type SuccessHandler<TResult> = (result: TResult) => void;

/**
 * Type for the API call error handlers.
 */
export type ErrorHandler = (error: ServiceError) => void;

export class BaseService {
    /**
     * Calls a specified API endpoint.
     * 
     * @param endpoint API endpoint to call
     * @param method HTTP method to use (GET, POST, PUT, DELETE)
     * @param data payload object
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public callApi<TPayload, TResult>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        data: TPayload | null,
        onSuccess: SuccessHandler<TResult>,
        onError: ErrorHandler,
    ): void {
        const url = `${endpoint}`;
        try {
            fetch(
                url,
                {
                    method: method,
                    mode: 'cors',
                    body: (data === null ? null : JSON.stringify(data)),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then(async (response) => {
                    // fetch() resolves promise successfully even if responce.ok is false
                    // If responce.ok === false treat the call as failed with nothing but HTTP status known
                    if (response.ok) {
                        return response.json();
                    } else {
                        return { 
                            _error: `Request rejected with status ${response.status}`, 
                            _code: response.status 
                        };
                    }
                }
                )
                .catch((error: Error) => { onError(new ServiceError(error.message)); })
                .then((response: TResult | ApiError) => { 
                    if (response) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ('_error' in (response as any)) {
                            const apiError: ApiError = response as ApiError;
                            const expected: boolean = 
                                (apiError._code === undefined || apiError._code === 200 || apiError._code === 400);
                            onError(new ServiceError(apiError._error, expected));
                        } else {
                            if (onSuccess) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const result: TResult = response as TResult;
                                onSuccess(result);
                            }
                        }
                    }
                })
                .catch((error: Error) => {
                if (onError) {
                    onError(new ServiceError(error.message));
                }
            });
        } catch (error) {
            if (onError) {
                onError(new ServiceError(error.message));
            }
        }
    }
}
/**
 * Type for the empty payload.
 */
export type EmptyPayload = {}

/**
 * Type for the empty result.
 */
export type EmptyResult = {}

/**
 * Type with API error information.
 */
export type ApiError = {
    _error: string;
    _code: number;
};

import ExtendableError from '../utils/ExtendableError';

export default class ServiceError extends ExtendableError {
    constructor(errors, errorDetails, request) {
        super('Service Error')
        this.errors = errors;
        this.errorDetails = errorDetails;
        this.request = request;
    }
}


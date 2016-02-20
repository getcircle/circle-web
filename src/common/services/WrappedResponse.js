import _ from 'lodash';
import normalize from 'protobuf-normalizr';
import protobufs from 'protobufs';

import { getNextRequest, getPaginator } from './helpers';
import ServiceError from './ServiceError';

export function getResponseExtensionName(action) {
    let basePath = protobufs.services.registry.responses.$type.fqn();
    return [basePath, _.capitalize(action.control.service), action.control.action].join('.');
}

export default class WrappedResponse {

    constructor(request, httpResponse, body) {
        this.request = request;
        this.httpResponse = httpResponse;
        this.response = protobufs.soa.ServiceResponseV1.decode(body);
        this.action = this._getFirstAction();
        this.result = this._getResult();
        this.errors = this._getErrors();
        this.errorDetails = this._getErrorDetails();
    }

    _getResult() {
        let action = this._getFirstAction();
        return action.result[getResponseExtensionName(action)];
    }

    _getErrors() {
        let action = this._getFirstAction();
        return action.result.errors;
    }

    _getErrorDetails() {
        let action = this._getFirstAction();
        return action.result.error_details;
    }

    _getFirstAction() {
        return this.response.actions[0];
    }

    isSuccess() {
        return this.action.result.success;
    }

    resolve(key = null) {
        const copy = this.result.$type.decode(this.result.encode());
        const normalized = normalize(copy, key);
        const paginator = getPaginator(this.response);
        return Object.assign({},
            {
                paginator,
                type: this.result.$type,
                nextRequest: getNextRequest(this.request, this.response),
            },
            normalized
        );
    }

    reject() {
        return new ServiceError(this.errors, this.errorDetails, this.request);
    }

    finish(resolve, reject, key = null) {
        if (this.isSuccess()) {
            return resolve(this.resolve(key));
        } else {
            return reject(this.reject());
        }
    }

    simple(resolve, reject) {
        if (this.isSuccess()) {
            return resolve();
        } else {
            return reject(this.reject());
        }
    }

}

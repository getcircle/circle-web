import _ from 'lodash';
import normalize from 'protobuf-normalizr';
import protobufs from 'protobufs';

import ServiceError from './ServiceError';

export const getResponseExtensionName = (action) => {
    let basePath = protobufs.services.registry.responses.$type.fqn();
    return [basePath, _.capitalize(action.control.service), action.control.action].join('.');
}

export default class WrappedResponse {

    constructor(request, httpResponse) {
        this.request = request;
        this.httpResponse = httpResponse;
        this.response = protobufs.soa.ServiceResponseV1.decode(this.httpResponse.xhr.response);
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

    getNextRequest() {
        // XXX not sure if there is a better way to do this
        let nextRequest = this.request.$type.decode(this.request.encode());
        let currentPaginator = this.getPaginator();
        let nextAction = nextRequest.actions[0];

        if (!currentPaginator || currentPaginator.next_page === null) {
            return null;
        }

        let paginatorData = _.assign({}, nextAction.control.paginator);
        /*eslint-disable new-cap*/
        nextAction.control.paginator = new currentPaginator.$type.clazz(paginatorData);
        /*eslint-enable new-cap*/
        nextAction.control.paginator.page = currentPaginator.next_page;
        /*eslint-disable camelcase*/
        nextAction.control.paginator.previous_page = currentPaginator.page;
        /*eslint-enable camelcase*/
        nextAction.control.paginator.count = currentPaginator.count;

        return nextRequest;
    }

    getPaginator() {
        let action = this._getFirstAction();
        return action.control.paginator;
    }

    isSuccess() {
        return this.action.result.success;
    }

    resolve(key=null) {
        const copy = this.result.$type.decode(this.result.encode());
        const normalized = normalize(copy, key);
        return Object.assign({},
            {type: this.result.$type, nextRequest: this.getNextRequest()},
            normalized
        );
    }

    reject() {
        return new ServiceError(this.errors, this.errorDetails, this.request);
    }

    finish(resolve, reject, key=null) {
        if (this.isSuccess()) {
            return resolve(this.resolve(key));
        } else {
            return reject(this.reject());
        }
    }

}

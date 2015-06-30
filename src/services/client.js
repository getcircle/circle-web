'use strict';

import _ from 'lodash';
import keymirror from 'keymirror';
import protobufs from 'protobufs';
import requests from 'superagent';

const ENVIRONMENTS = keymirror({
    local: null,
    production: null,
});

class WrappedResponse {

    constructor(request, httpResponse) {
        this.request = request;
        this.httpResponse = httpResponse;
        this.response = protobufs.soa.ServiceResponseV1.decode(this.httpResponse.xhr.response);
        this.result = this._getResult();
        this.errors = this._getErrors();
        this.errorDetails = this._getErrorDetails();
    }

    _getResponseExtensionName(action) {
        let basePath = protobufs.services.registry.responses.$type.fqn();
        return [basePath, _.capitalize(action.control.service), action.control.action].join('.');
    }

    _getResult() {
        let action = this._getFirstAction();
        return action.result[this._getResponseExtensionName(action)];
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

        if (currentPaginator.next_page === null) {
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

        return nextRequest;
    }

    getPaginator() {
        let action = this._getFirstAction();
        return action.control.paginator;
    }

}

class Transport {

    constructor() {
        // TODO figure out where to put these configs
        this._environment = ENVIRONMENTS.local;
        this._token = null;
    }

    set token(value) {
        this._token = value;
    }

    get _scheme() {
        switch (this._environment) {
            case ENVIRONMENTS.local:
                return 'http';
            default:
                return 'https';
        }
    }

    get _host() {
        switch (this._environment) {
            case ENVIRONMENTS.local:
                return 'localhost:8000';
            default:
                return 'api.circlehq.co';
        }
    }

    get _endpoint() {
        return `${ this._scheme }://${ this._host }`;
    }

    sendRequest(request) {
        return new Promise((resolve, reject) => {
            // TODO set authorization header for authenticated requests
            requests
                .post(this._endpoint)
                .set('Authorization', this._token ? `Token ${this._token}` : '')
                .type('application/x-protobuf')
                .send(request.toArrayBuffer())
                .responseType('arraybuffer')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        // TODO should reject with failures from the service
                        // TODO should handle any decoding errors
                        let response = new WrappedResponse(request, res);
                        resolve(response);
                    }
                });
        });
    }

}

class Client {

    constructor(token) {
        this._token = token;
        this.transport = new Transport();
    }

    buildRequest(action, params) {
        // $type.fqn is something like ".services.user.actions.get_active_devices.RequestV1"
        let service = params.$type.fqn().split('.')[2];
        let actionExtensionName = this._getRequestExtensionName(service, action);

        let serviceControl = new protobufs.soa.ControlV1({service: service, token: this._token});
        let serviceRequest = new protobufs.soa.ServiceRequestV1({control: serviceControl});

        let actionControl = new protobufs.soa.ActionControlV1({service: service, action: action});
        let actionParams = new protobufs.soa.ActionRequestParamsV1();
        // TODO this should raise an exception if we can't find
        // actionExtensionName within the actionRequestParams object, i'm not
        // sure what the proper way to do that in JS land is
        actionParams[actionExtensionName] = params;

        let actionRequest = new protobufs.soa.ActionRequestV1({control: actionControl, params: actionParams});
        serviceRequest.actions.push(actionRequest);
        return serviceRequest;
    }

    sendRequest(protobufRequest) {
        let request = this.buildRequest(protobufRequest.$type.parent.name, protobufRequest);
        return this.transport.sendRequest(request);
    }

    sendNextRequest(nextRequest) {
        return this.transport.sendRequest(nextRequest);
    }

    _getRequestExtensionName(service, action) {
        let basePath = protobufs.services.registry.requests.$type.fqn();
        return [basePath, _.capitalize(service), action].join('.');
    }

    authenticate(token) {
        this._token = token;
        this.transport.token = token;
    }

    logout() {
        this._token = null;
        this.transport.token = null;
    }

}

export default new Client();

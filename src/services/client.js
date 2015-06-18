import _ from 'lodash';
import keymirror from 'keymirror';
import protobufs from 'protobufs';
import requests from 'superagent';

const ENVIRONMENTS = keymirror({
    local: null,
    production: null,
});


class WrappedResponse {

    constructor(httpResponse) {
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
        let action = this.response.actions[0];
        return action.result[this._getResponseExtensionName(action)];
    }

    _getErrors() {
        let action = this.response.actions[0];
        return action.result.errors;
    }

    _getErrorDetails() {
        let action = this.response.actions[0];
        return action.result.error_details;
    }

}


class Transport {

    constructor(token) {
        this.token = token;
        // TODO figure out where to put these configs
        this.environment = ENVIRONMENTS.local;
    }

    get _scheme() {
        switch (this.environment) {
            case ENVIRONMENTS.local:
                return 'http';
            default:
                return 'https';
        }
    }

    get _host() {
        switch (this.environment) {
            case ENVIRONMENTS.local:
                return 'localhost:8000';
            default:
                return 'api.circlehq.co';
        }
    }

    get _endpoint() {
        return `${ this._scheme }://${ this._host }`;
    }

    sendRequest(serializedRequest) {
        return new Promise((resolve, reject) => {
            // TODO set authorization header for authenticated requests
            requests
                .post(this._endpoint)
                .type('application/x-protobuf')
                .send(serializedRequest)
                .responseType('arraybuffer')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        // TODO should reject with failures from the service
                        // TODO should handle any decoding errors
                        let response = new WrappedResponse(res);
                        resolve(response);
                    }
                });
        });
    }

}


class Client {

    constructor() {
        this.transport = new Transport();
    }

    buildRequest(action, params) {
        // $type.fqn is something like ".services.user.actions.get_active_devices.RequestV1"
        let service = params.$type.fqn().split('.')[2];
        let actionExtensionName = this._getRequestExtensionName(service, action);

        let serviceControl = new protobufs.soa.ControlV1({service: service, token: this.token});
        let serviceRequest = new protobufs.soa.ServiceRequestV1({control: serviceControl});

        let actionControl = new protobufs.soa.ActionControlV1({service: service, action: action});
        let actionParams = new protobufs.soa.ActionRequestParamsV1();
        // TODO this should raise an exception if we can't find
        // actionExtensionName within the actionRequestParams object, i'm not
        // sure what the proper way to do that in JS land is
        actionParams[actionExtensionName] = params;

        let actionRequest = new protobufs.soa.ActionRequestV1({control: actionControl, params: actionParams});
        serviceRequest.actions.push(actionRequest);
        return serviceRequest.toArrayBuffer();
    }

    sendRequest(protobufRequest) {
        let serializedRequest = this.buildRequest(protobufRequest.$type.parent.name, protobufRequest);
        return this.transport.sendRequest(serializedRequest);
    }

    _getRequestExtensionName(service, action) {
        let basePath = protobufs.services.registry.requests.$type.fqn();
        return [basePath, _.capitalize(service), action].join('.');
    }

    set token(value) {
        this.transport.token = value;
    }
}

export default new Client();

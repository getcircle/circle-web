import _ from 'lodash';
import protobufs from 'protobufs';

import Transport from './Transport';

class Client {

    constructor(req, transportAuth) {
        this.transport = new Transport(req, transportAuth);
    }

    buildRequest(action, params, allPages = false) {
        // $type.fqn is something like ".services.user.actions.get_active_devices.RequestV1"
        let service = params.$type.fqn().split('.')[2];
        let actionExtensionName = this._getRequestExtensionName(service, action);

        let serviceControl = new protobufs.soa.ControlV1({service: service});
        let serviceRequest = new protobufs.soa.ServiceRequestV1({control: serviceControl});

        const controlParams = {service, action};
        if (allPages) {
            /*eslint-disable camelcase*/
            controlParams.paginator = {page_size: 500};
            /*eslint-enable camelcase*/
        }
        let actionControl = new protobufs.soa.ActionControlV1(controlParams);
        let actionParams = new protobufs.soa.ActionRequestParamsV1();
        // TODO this should raise an exception if we can't find
        // actionExtensionName within the actionRequestParams object, i'm not
        // sure what the proper way to do that in JS land is
        actionParams[actionExtensionName] = params;

        let actionRequest = new protobufs.soa.ActionRequestV1({control: actionControl, params: actionParams});
        serviceRequest.actions.push(actionRequest);
        return serviceRequest;
    }

    send(partialOrFullRequest, allPages = false) {
        let request;
        if (partialOrFullRequest instanceof protobufs.soa.ServiceRequestV1) {
            request = partialOrFullRequest;
        } else {
            request = this.buildRequest(partialOrFullRequest.$type.parent.name, partialOrFullRequest, allPages);
        }
        return this.transport.sendRequest(request);
    }

    sendRequest(protobufRequest) {
        const request = this.buildRequest(protobufRequest.$type.parent.name, protobufRequest);
        return this.transport.sendRequest(request);
    }

    sendNextRequest(nextRequest) {
        return this.transport.sendRequest(nextRequest);
    }

    _getRequestExtensionName(service, action) {
        let basePath = protobufs.services.registry.requests.$type.fqn();
        return [basePath, _.capitalize(service), action].join('.');
    }

}

export default Client;

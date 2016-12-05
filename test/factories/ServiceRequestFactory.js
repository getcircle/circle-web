import { soa } from 'protobufs';

export default {
    getRequest(paginator = {}, control = {}, request = {}) {
        return new soa.ServiceRequestV1({
            actions: [
                /*eslint-disable camelcase*/
                {control: {paginator: {previous_page: 1, ...paginator}, ...control}},
                /*eslint-enable camelcase*/
            ],
            ...request,
        });
    },

};

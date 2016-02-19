import { soa } from 'protobufs';

export default {
    getResponse(paginator = {}, control = {}, response = {}) {
        return new soa.ServiceResponseV1({
            actions: [
                /*eslint-disable camelcase*/
                {control: {paginator: {previous_page: 1, ...paginator}, ...control}},
                /*eslint-enable camelcase*/
            ],
            ...response,
        });
    },

};

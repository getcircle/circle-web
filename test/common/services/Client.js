import expect from 'expect.js';
import normalize from 'protobuf-normalizr';
import protobufs from 'protobufs';

import ServiceError from '../../../src/common/services/ServiceError';
import WrappedResponse, { getResponseExtensionName } from '../../../src/common/services/WrappedResponse';

function mockWrappedResponse(serviceResponse, request = new protobufs.soa.ServiceRequestV1()) {
    return new WrappedResponse(request, {}, serviceResponse.encode());
}

function mockServiceResponseError(serviceName, actionName, errors, errorDetails) {
    let response = new protobufs.soa.ServiceResponseV1();
    let action = new protobufs.soa.ActionResponseV1({
        control: new protobufs.soa.ActionControlV1({
            action: actionName,
            service: serviceName,
        }),
        result: new protobufs.soa.ActionResultV1({
            success: false,
            errors: errors,
            /*eslint-disable camelcase*/
            error_details: errorDetails,
            /*eslint-enable camelcase*/
        }),
    });
    response.add('actions', action);
    return response;
}

function mockServiceResponseSuccess(serviceName, actionName, result) {
    let response = new protobufs.soa.ServiceResponseV1();
    let action = new protobufs.soa.ActionResponseV1({
        control: new protobufs.soa.ActionControlV1({
            action: actionName,
            service: serviceName,
        }),
        result: new protobufs.soa.ActionResultV1({success: true}),
    });
    action.result[getResponseExtensionName(action)] = result;
    response.add('actions', action);
    return response;
};

describe('WrappedResponse', function () {

    beforeEach(function () {
        const serviceResponse = mockServiceResponseSuccess(
            'profile',
            'get_profile',
            new protobufs.services.profile.actions.get_profile.ResponseV1()
        );
        this.response = mockWrappedResponse(serviceResponse);
    })

    describe('resolve', function () {
        it('returns our standard service action response', function () {
            const profileId = 'some-id';
            const resolved = this.response.resolve(profileId);
            const expected = Object.assign({},
                {type: this.response.result.$type, nextRequest: null, paginator: null},
                normalize(this.response.result, profileId)
            );
            expect(resolved).to.eql(expected);
        });
    })

    describe('reject', function () {
        it('rejects to our standard service action rejection', function () {
            const errors = ['FIELD_ERROR'];
            const errorDetails = [
                new protobufs.soa.ActionResultV1.ErrorDetailV1({
                    version: 1,
                    error: 'FIELD_ERROR',
                    key: 'SOME_FIELD',
                    detail: 'INVALID',
                }),
            ];
            const serviceResponse = mockServiceResponseError('profile', 'get_profile', errors, errorDetails)
            const request = new protobufs.soa.ServiceRequestV1();
            const response = mockWrappedResponse(serviceResponse, request);
            const rejected = response.reject();
            const expected = new ServiceError(errors, errorDetails, request);
            expect(rejected).to.eql(expected);
        });
    });

    describe('finish', function () {
        it('resolves if we have a successful result', function (done) {
            const profileId = 'some-id';
            new Promise((resolve, reject) => {
                return this.response.finish(resolve, reject, profileId);
            })
                .then((resolved) => {
                    const expected = Object.assign({},
                        {type: this.response.result.$type, nextRequest: null, paginator: null},
                        normalize(this.response.result, profileId),
                    );
                    expect(resolved).to.eql(expected);
                    done();
                })
                .catch(error => done(error));
        });

        it('rejects if we have an error', function (done) {
            const errors = ['FIELD_ERROR'];
            const errorDetails = [
                new protobufs.soa.ActionResultV1.ErrorDetailV1({
                    version: 1,
                    error: 'FIELD_ERROR',
                    key: 'SOME_FIELD',
                    detail: 'INVALID',
                }),
            ];
            const serviceResponse = mockServiceResponseError('profile', 'get_profile', errors, errorDetails)
            const request = new protobufs.soa.ServiceRequestV1();
            const response = mockWrappedResponse(serviceResponse);
            new Promise((resolve, reject) => {
                return response.finish(resolve, reject, 'identifier');
            })
                .then(() => {
                    exect().fail('response should have been rejected');
                    done();
                })
                .catch((error) => {
                    const expected = new ServiceError(errors, errorDetails, request);
                    expect(error).to.eql(expected);
                    done();
                })
                .catch(error => done(error));
        });
    });

});

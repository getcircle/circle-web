import expect from 'expect.js';
import sinon from 'sinon'

import servicesMiddleware, { SERVICE_REQUEST } from '../../../src/common/middleware/services';

describe('services middleware', function () {

    beforeEach(function () {
        this.next = sinon.spy();
        this.store = {
            getState: sinon.spy(),
            dispatch: sinon.spy(),
        };
    })

    it('only acts on actions with the SERVICE_REQUEST Symbol', function () {
        const action = {
            types: ['non-service-request'],
            remote: () => true,
        }
        servicesMiddleware(this.store)(this.next)(action);
        expect(this.store.getState.calledOnce).to.be.false;
    });

    it('fails if not given 3 string types', function () {
        let action = {
            [SERVICE_REQUEST]: {
                types: 'fail',
            },
        };
        expect(servicesMiddleware(this.store)(this.next)).withArgs(action)
            .to.throwException(/array of three action types/);

        action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success'],
            },
        };
        expect(servicesMiddleware(this.store)(this.next)).withArgs(action)
            .to.throwException(/array of three action types/);

        action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 100],
            },
        };
        expect(servicesMiddleware(this.store)(this.next)).withArgs(action)
            .to.throwException(/action types to be strings/);
    });

    it('fails if "remote" isn\'t a function', function () {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: 'invalid',
            },
        };
        expect(servicesMiddleware(this.store)(this.next)).withArgs(action)
            .to.throwException(/remote to be a function/);
    });

    it('fails if "bailout" isn\'t a function', function () {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: () => true,
                bailout: 'invalid',
            },
        };
        expect(servicesMiddleware(this.store)(this.next)).withArgs(action)
            .to.throwException(/bailout to be a function or undefined/);
    });

    it('bailouts out if "bailout" returns true', function () {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: sinon.spy(),
                bailout: (state) => true,
            }
        };
        servicesMiddleware(this.store)(this.next)(action);
        expect(action[SERVICE_REQUEST].remote.calledOnce).to.not.be.ok();
        expect(this.next.calledOnce).to.not.be.ok();
    });

    it('dispatches requestType and successType if the remote call succeeds', function (done) {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: (state) => Promise.resolve(),
            },
        };
        servicesMiddleware(this.store)(this.next)(action)
            .then(() => {
                expect(this.next.callCount).to.be(2);
                expect(this.next.getCall(0).args[0].type).to.be('request');
                expect(this.next.getCall(1).args[0].type).to.be('success');
                done();
            })
            .catch((error) => done(error));
    });

    it('dispatches requestType and failureType if the remote call fails', function (done) {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: (state) => Promise.reject(new Error('API Error')),
            },
        };
        servicesMiddleware(this.store)(this.next)(action)
            .then(() => {
                expect(this.next.callCount).to.be(2);
                expect(this.next.getCall(0).args[0].type).to.be('request');
                const errorAction = this.next.getCall(1).args[0];
                expect(errorAction.type).to.be('error');
                expect(errorAction.error).to.be.ok();
                expect(errorAction.payload.toString()).to.be('Error: API Error');
                done();
            })
            .catch((error) => done(error));
    });

    it('dispatches actions with payload', function (done) {
        const action = {
            [SERVICE_REQUEST]: {
                types: ['request', 'success', 'error'],
                remote: (state) => Promise.resolve(),
            },
            payload: {value: 'here'},
        };
        servicesMiddleware(this.store)(this.next)(action)
            .then(() => {
                const request = this.next.getCall(0).args[0];
                expect(request.payload.value).to.be('here');
                expect(request[SERVICE_REQUEST]).to.be(undefined);
                done();
            })
            .catch((error) => done(error));
    });

});

import expect from 'expect.js';
import Immutable from 'immutable';
import { soa } from 'protobufs';

import paginate from '../../src/reducers/paginate';

describe('paginate reducer', function () {

    beforeEach(function () {
        this.paginatedReducer = paginate({
            mapActionToKey: action => action.meta.key,
            types: [
                'requestType',
                'successType',
                'failureType',
            ],
        });
    })

    it('throws an error if not given three types', function () {
        expect(paginate).withArgs({types: ['requestType']})
            .to.throwException(/types to be an array of three elements/);
    });

    it('throws an error if not given types of string', function () {
        expect(paginate).withArgs({types: [1, 2, 3]})
            .to.throwException(/types to be strings/);
    });

    it('throws an error if `mapActionToKey` is not a function', function () {
        expect(paginate).withArgs({types: ['requestType', 'successType', 'failureType'], mapActionToKey: 'invalid'})
            .to.throwException(/to be a function/);
    });

    it('throws an error if mapActionToResults is not a function', function () {
        expect(paginate).withArgs({types: ['requestType', 'successType', 'failureType'], mapActionToKey: action => action.meta.key, mapActionToResults: 'invalid'})
            .to.throwException(/to be a function/);
    })

    it('returns the correct initial state', function () {
        const state = this.paginatedReducer(undefined, {});
        expect(state).to.be.an(Immutable.Map);
    });

    it('returns the correct state for a request action', function () {
        const action = {
            type: 'requestType',
            payload: {},
            meta: {
                key: 'key',
            },
        }
        const state = this.paginatedReducer(undefined, action);
        expect(state.has('key')).to.be.ok();
        const keyState = state.get('key');
        expect(keyState.get('loading')).to.be.ok();
        expect(keyState.get('ids')).to.be.an(Immutable.OrderedSet);
        expect(keyState.get('nextRequest')).to.be(null);
        expect(keyState.get('ttl')).to.be(null);
    });

    it('returns the correct state for a success action', function () {
        const ids = Immutable.OrderedSet(['id-1', 'id-2', 'id-3'])
        const action = {
            type: 'successType',
            payload: {
                result: ids.toJS(),
                nextRequest: new soa.ServiceRequestV1(),
            },
            meta: {
                key: 'key',
            }
        }
        const state = this.paginatedReducer(undefined, action);
        expect(state.has('key')).to.be.ok();
        const keyState = state.get('key');
        expect(keyState.get('loading')).to.not.be.ok();
        expect(keyState.get('nextRequest')).to.be.an(soa.ServiceRequestV1);
        expect(keyState.get('ttl')).to.not.be(null);
        expect(keyState.get('ids').toJS()).to.eql(ids.toJS());
    });

    it('returns the correct state for a failure action', function () {
        const action = {
            type: 'failureType',
            error: true,
            payload: new Error('API Failure'),
            meta: {
                key: 'key',
            }
        };
        const state = this.paginatedReducer(undefined, action);
        expect(state.has('key')).to.be.ok();
        const keyState = state.get('key');
        expect(keyState.get('loading')).to.not.be.ok();
    });

    it('correctly dedupes ids that are added for a value', function () {
        const ids = ['id-1', 'id-2', 'id-3']
        const action = {
            type: 'successType',
            payload: {
                result: ids,
                nextRequest: new soa.ServiceRequestV1(),
            },
            meta: {
                key: 'key',
            }
        }
        let state = this.paginatedReducer(undefined, action);
        // pass the same action and verify that we didn't add duplicate ids
        state = this.paginatedReducer(state, action);
        let keyState = state.get('key');
        expect(keyState.get('ids').toJS()).to.eql(ids);

        // simulate new action with new ids
        action.payload.result = ['id-4', 'id-5', 'id-6'];
        state = this.paginatedReducer(state, action);
        keyState = state.get('key');
        expect(keyState.get('ids').size).to.be(6);
    });

    it('supports a custom method for pulling results out of the payload', function () {
        const ids = ['id-1', 'id-2', 'id-3']
        const action = {
            type: 'successType',
            payload: {
                profileIds: ids,
                nextRequest: new soa.ServiceRequestV1(),
            },
            meta: {
                key: 'key',
            }
        }
        const reducer = paginate({
            mapActionToKey: action => action.meta.key,
            mapActionToResults: action => action.payload.profileIds,
            types: [
                'requestType',
                'successType',
                'failureType',
            ],
        });
        const state = reducer(undefined, action);
        const keyState = state.get('key');
        expect(keyState.get('ids').toJS()).to.eql(ids);
    });

});

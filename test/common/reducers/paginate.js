import expect from 'expect.js';
import Immutable from 'immutable';
import { soa } from 'protobufs';

import { getPaginator } from '../../../src/common/services/helpers';
import paginate, { rewind } from '../../../src/common/reducers/paginate';

import ServiceRequestFactory from '../../factories/ServiceRequestFactory';

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
            .to.throwException(/types to be an array of at least three elements/);
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
                nextRequest: ServiceRequestFactory.getRequest(),
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
        expect(keyState.get('pages').toJS()).to.eql([1]);
        expect(keyState.get('currentPage')).to.eql(1);
    });

    it('returns the correct state for a bailed action', function () {
        // set state to currentPage 1, pages [1, 2], on bail action, we should set currentPage to 2
        //
        const paginatedReducer = paginate({
            mapActionToKey: action => action.meta.key,
            types: [
                'requestType',
                'successType',
                'failureType',
                'bailType',
            ],
        });


        let state = paginatedReducer(undefined, {});
        // simulate fetching two pages of data
        for (let i = 1; i < 3; i++) {
            let action = {
                type: 'successType',
                payload: {
                    result: [],
                    /*eslint-disable camelcase*/
                    nextRequest: ServiceRequestFactory.getRequest({previous_page: i, page: i + 1}),
                    /*eslint-enable camelcase*/
                },
                meta: {
                    key: 'key',
                },
            };
            state = paginatedReducer(state, action);
        }
        let paginator = getPaginator(state.get('key').get('nextRequest'));
        expect(paginator.page).to.eql(3);
        expect(paginator.previous_page).to.eql(2);
        expect(state.get('key').get('currentPage')).to.eql(2);

        // rewind state back to first page
        state = rewind('key', state);
        paginator = getPaginator(state.get('key').get('nextRequest'));
        expect(paginator.page).to.eql(2);
        expect(paginator.previous_page).to.eql(1);
        expect(state.get('key').get('currentPage')).to.eql(1);

        const action = {
            type: 'bailType',
            payload: {
                paginator: {page: 2},
            },
            meta: {
                key: 'key',
            },
        };
        state = paginatedReducer(state, action);
        expect(state.get('key').get('currentPage')).to.eql(2, 'currentPage should have been incremented with bailout action');
        paginator = getPaginator(state.get('key').get('nextRequest'));
        expect(paginator.page).to.eql(3);
        expect(paginator.previous_page).to.eql(2);
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
                nextRequest: ServiceRequestFactory.getRequest(),
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
                nextRequest: ServiceRequestFactory.getRequest(),
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

    describe('rewind', () => {

        it('handles not having a nextRequest', () => {
            const state = Immutable.fromJS({
                'key': {
                    nextRequest: null,
                    currentPage: 1,
                },
            });

            const rewound = rewind('key', state);
            const keyState = rewound.get('key');
            expect(keyState.get('nextRequest')).to.be(null);
            expect(keyState.get('currentPage')).to.be(1);
        });

    });

});

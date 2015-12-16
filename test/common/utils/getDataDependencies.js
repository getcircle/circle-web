import expect from 'expect';
import getDataDependencies from '../../../src/common/utils/getDataDependencies';

describe('getDataDependencies', () => {
    let getState;
    let dispatch;
    let location;
    let params;
    let url;
    let CompWithFetchData;
    let CompWithNoData;
    let CompWithFetchDataDeferred;
    const NullComponent = null;

    beforeEach(() => {
        getState = 'getState';
        dispatch = 'dispatch';
        location = 'location';
        params = 'params';
        url = 'urlContext';

        CompWithNoData = () =>
            <div />;

        CompWithFetchData = () =>
            <div />;

        CompWithFetchData.fetchData = (_getState, _dispatch, _location, _params, _url) => {
            return `fetchData ${_getState} ${_dispatch} ${_location} ${_params} ${_url}`;
        };

        CompWithFetchDataDeferred = () =>
            <div />;

        CompWithFetchDataDeferred.fetchDataDeferred = (_getState, _dispatch, _location, _params, _url) => {
            return `fetchDataDeferred ${_getState} ${_dispatch} ${_location} ${_params} ${_url}`;
        };
    });

    it('should get fetchDatas', () => {
        const deps = getDataDependencies([
            NullComponent,
            CompWithFetchData,
            CompWithNoData,
            CompWithFetchDataDeferred
        ], getState, dispatch, location, params, url);

        expect(deps).toEqual(['fetchData getState dispatch location params urlContext']);
    });

    it('should get fetchDataDeferreds', () => {
        const deps = getDataDependencies([
            NullComponent,
            CompWithFetchData,
            CompWithNoData,
            CompWithFetchDataDeferred
        ], getState, dispatch, location, params, url, true);

        expect(deps).toEqual(['fetchDataDeferred getState dispatch location params urlContext']);
    });
});

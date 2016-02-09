// XXX remove this, its deprecated
import expect from 'expect';
import React from 'react';
import connectData from '../../../src/common/utils/connectData';

describe('connectData', () => {
    let fetchData;
    let fetchDataDeferred;
    let WrappedComponent;
    let DataComponent;

    beforeEach(() => {
        fetchData = 'fetchDataFunction';
        fetchDataDeferred = 'fetchDataDeferredFunction';

        WrappedComponent = () =>
            <div />;

        DataComponent = connectData(fetchData, fetchDataDeferred)(WrappedComponent);
    });

    it('should set fetchData as a static property of the final component', () => {
        expect(DataComponent.fetchData).toEqual(fetchData);
    });

    it('should set fetchDataDeferred as a static property of the final component', () => {
        expect(DataComponent.fetchDataDeferred).toEqual(fetchDataDeferred);
    });
});

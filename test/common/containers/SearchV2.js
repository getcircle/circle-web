import expect from 'expect';

import { Search } from '../../../src/common/containers/SearchV2';

import SearchDetail from '../../../src/common/components/SearchDetail';

const setup = buildSetup(Search, () => {
    return {
        loading: false,
        params: { query: 'something' },
        results: {},
    };
});

describe('Search', () => {

    it('renders the SearchDetail', () => {
        const { wrapper } = setup();
        debugger;
        const detail = wrapper.find(SearchDetail);
        expect(detail.length).toEqual(1);
    });

});

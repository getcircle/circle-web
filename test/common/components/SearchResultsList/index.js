import expect from 'expect';

import SearchResultsList, { SearchResultItem } from '../../../../src/common/components/SearchResultsList';

import SearchResultFactory from '../../../factories/SearchResultFactory';

const setup = buildSetup(SearchResultsList);

describe('SearchResultsList', () => {

    it('renders a set of profile results', () => {
        const results = [];
        for (let i = 0; i < 3; i++) {
            const result = SearchResultFactory.getSearchResultWithProfile(true);
            results.push(result);
        };

        const { wrapper } = setup({results});
        expect(wrapper.find(SearchResultItem).length).toEqual(results.length);
    });

});

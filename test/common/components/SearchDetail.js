import expect from 'expect';

import SearchResults from '../../../src/common/components/SearchResults';
import SearchDetail, { SearchDetailHeader } from '../../../src/common/components/SearchDetail';

const setup = buildSetup(SearchDetail, () => {
    return {
        results: [{}],
        totalResults: 4,
        query: 'something',
    }
});

describe('SearchDetail', () => {

    describe('SearchDetailHeader', () => {

        it('renders the correct text with 1 result', () => {
            const { wrapper, props } = setup({totalResults: 1}, SearchDetailHeader);
            expect(wrapper.find('span').text()).toEqual(`${props.totalResults} Result for "${props.query}"`);
        });

        it('renders the correct text with 0 results', () => {
            const { wrapper, props } = setup({totalResults: 0}, SearchDetailHeader);
            expect(wrapper.find('span').text()).toEqual(`${props.totalResults} Results for "${props.query}"`);
        });

        it('renders the correct text with multiple results', () => {
            const { wrapper, props } = setup({totalResults: 10}, SearchDetailHeader);
            expect(wrapper.find('span').text()).toEqual(`${props.totalResults} Results for "${props.query}"`);
        });

    });

    it('renders the SearchDetailHeader', () => {
        const { wrapper, props } = setup();
        const header = wrapper.find(SearchDetailHeader);
        expect(header.length).toEqual(1);
        expect(header.prop('totalResults')).toEqual(props.totalResults);
        expect(header.prop('query')).toEqual(props.query);
    });

    it('renders the SearchResults', () => {
        const { wrapper, props } = setup();
        const results = wrapper.find(SearchResults);
        expect(results.length).toEqual(1);
        expect(results.prop('results')).toEqual(props.results);
    });

});

import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { ListItem } from 'material-ui';

import SearchResults from '../../../../src/common/components/SearchResults';

import SearchResultFactory from '../../../factories/SearchResultFactory';

function setup(overrides) {
    const defaults = {};
    const props = Object.assign({}, defaults, overrides);
    const output = TestUtils.renderIntoDocument(<SearchResults {...props} />);
    return { props, output };
};

describe('SearchResults', () => {

    it('renders a set of profile results', () => {
        const results = [];
        for (let i = 0; i < 3; i++) {
            const result = SearchResultFactory.getSearchResultWithProfile(true);
            results.push(result);
        };

        const { output } = setup({results});
        const items = TestUtils.scryRenderedComponentsWithType(output, ListItem);
        expect(items.length).toEqual(results.length);
    });

});

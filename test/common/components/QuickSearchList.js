import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import QuickSearchList from '../../../src/common/components/QuickSearchList';

function setup(overrides) {
    const defaults = {};
    const props = Object.assign({}, defaults, overrides);
    let output = TestUtils.renderIntoDocument(<QuickSearchList {...props} />);
    return {props, output};
}

describe('QuickSearchList', () => {

    it('displays a title if provided', () => {
        const { output } = setup({title: 'Some Title'});
        const title = TestUtils.findRenderedDOMComponentWithTag(output, 'span');
        expect(title.textContent).toEqual('Some Title');
    });

    it('doesn\'t display a title if none is provided', () => {
        const { output } = setup();
        const spans = TestUtils.scryRenderedDOMComponentsWithTag(output, 'span');
        expect(spans.length).toEqual(0);
    });

});

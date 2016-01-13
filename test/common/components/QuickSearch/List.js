import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import List from '../../../../src/common/components/QuickSearch/List';

function setup(overrides) {
    const defaults = {};
    const props = Object.assign({}, defaults, overrides);
    let output = TestUtils.renderIntoDocument(<List {...props} />);
    return {props, output};
}

describe('List', () => {

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

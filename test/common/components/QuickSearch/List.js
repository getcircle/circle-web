import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { ListItem } from 'material-ui';

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

    describe('items', () => {

        it('calls onTouchTap when selected', () => {
            const onTouchTapSpy = expect.createSpy();
            const item = {onTouchTap: onTouchTapSpy};
            const { output } = setup({items: [item]});
            const listItem = TestUtils.findRenderedComponentWithType(output, ListItem);
            listItem.props.onTouchTap();
            expect(onTouchTapSpy.calls.length).toEqual(1);
        });

    });

    describe('onSelectItem', () => {

        it('is called when onTouch tap is triggered for an item', () => {
            const onTouchTapSpy = expect.createSpy();
            const onSelectItemSpy = expect.createSpy();
            const item = {onTouchTap: onTouchTapSpy};
            const { output } = setup({items: [item], onSelectItem: onSelectItemSpy});
            const listItem = TestUtils.findRenderedComponentWithType(output, ListItem);
            listItem.props.onTouchTap();
            expect(onTouchTapSpy.calls.length).toEqual(1, 'Should have called the item\'s onTouchTap');
            expect(onSelectItemSpy.calls.length).toEqual(1, 'Should have called the list\'s onTouchTap');
        });

    });

});

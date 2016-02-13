import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { ListItem } from 'material-ui';

import List from '../../../../src/common/components/Search/List';

function setup(overrides) {
    const props = {
        ...overrides
    };
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

        it('calls onSelectItem when selected', () => {
            const item = {type: 'RESULT', payload: true};
            const { output, props } = setup({items: [item], onSelectItem: expect.createSpy()});
            const listItem = TestUtils.findRenderedComponentWithType(output, ListItem);
            listItem.props.onTouchTap();
            expect(props.onSelectItem.calls.length).toEqual(1);
            const callArg = props.onSelectItem.calls[0].arguments[0];
            expect(callArg.type).toEqual('RESULT');
            expect(callArg.payload).toExist();
        });

    });

    describe('onSelectItem', () => {

        it('is called when onTouch tap is triggered for an item', () => {
            const onSelectItemSpy = expect.createSpy();
            const item = {type: 'RESULT'};
            const { output } = setup({items: [item], onSelectItem: onSelectItemSpy});
            const listItem = TestUtils.findRenderedComponentWithType(output, ListItem);
            listItem.props.onTouchTap();
            expect(onSelectItemSpy.calls.length).toEqual(1, 'Should have called the list\'s onTouchTap');
        });

    });

});

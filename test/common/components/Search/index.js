import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { ListItem } from 'material-ui';

import componentWithContext from '../../../componentWithContext';
import Search from '../../../../src/common/components/Search';
import List from '../../../../src/common/components/Search/List';
import Section from '../../../../src/common/components/Search/Section';

function setup(overrides, includeSections) {
    const defaults = {
        dispatch: expect.createSpy(),
    };
    if (includeSections) {
        defaults.sections = [new Section([{}, {}], 'Section - 1'), new Section([{}, {}], 'Section - 2')];
    }
    const props = Object.assign({}, defaults, overrides);
    const Container = componentWithContext(<Search {...props} />);
    const container = TestUtils.renderIntoDocument(<Container />);
    const output = TestUtils.findRenderedComponentWithType(container, Search);
    return {props, output};
}

describe('Search', () => {

    describe('sections', () => {

        it('renders them in the order provided', () => {
            const sectionOneItems = [{className: '1-1'}, {className: '1-2'}, {className: '1-3'}];
            const sectionTwoItems = [{className: '2-1'}, {className: '2-2'}, {className: '2-3'}];
            const sections = [new Section(sectionOneItems, 'Section One'), new Section(sectionTwoItems, 'Section Two')];
            const { output } = setup({sections});
            const lists = TestUtils.scryRenderedComponentsWithType(output, List);
            expect(lists.length).toEqual(2);
            expect(lists[0].props.items).toEqual(sectionOneItems);
            expect(lists[1].props.items).toEqual(sectionTwoItems);
            const items = TestUtils.scryRenderedComponentsWithType(output, ListItem);
            expect(items.length).toEqual(6);
        });

        it('renders a title for the section if present', () => {
            const section = new Section([{}, {}], 'Section');
            const { output } = setup({sections: [section]});
            const title = TestUtils.scryRenderedDOMComponentsWithTag(output, 'span')[0];
            expect(title.textContent).toEqual('Section');
        });

        it('doesn\'t default to highlighting any index', () => {
            const { output } = setup(undefined, true);
            expect(output.state.highlightedIndex).toBe(null);
        });

        it('loops through available items when highlighting', () => {
            const sections = [new Section([{}, {}]), new Section([{}, {}])];
            const { output } = setup({sections});
            for (let i = 0; i < 5; i++) {
                TestUtils.Simulate.keyDown(output.refs.input, {key: 'ArrowDown'});
                if (i === 2) {
                    expect(output.state.highlightedIndex).toEqual(2, 'Should have keyed down to the end of the items');
                };
            }
            expect(output.state.highlightedIndex).toEqual(0, 'Should have cycled back to the top of the items');
            TestUtils.Simulate.keyDown(output.refs.input, {key: 'ArrowUp'});
            expect(output.state.highlightedIndex).toEqual(3, 'Should have cycled back to the bottom of the items');
        });

        it('resets the highlighted index back to null after blur', () => {
            const { output } = setup(undefined, true);
            TestUtils.Simulate.keyDown(output.refs.input, {key: 'ArrowDown'});
            expect(output.state.highlightedIndex).toEqual(0);
            TestUtils.Simulate.keyDown(output.refs.input, {key: 'Escape'});
            expect(output.state.highlightedIndex).toBe(null);
        });

        it('allows a section to specify an initially highlighted index', () => {
            const sections = [new Section([{}, {}]), new Section([{}, {}], undefined, 0)];
            const { output } = setup({sections});
            expect(output.state.highlightedIndex).toEqual(2);
        });

        it('resets the highlightedIndex to null if the query is empty', (done) => {
            const { output } = setup(undefined, true);
            TestUtils.Simulate.change(output.refs.input, {target: {value: 'a'}});
            then(() => {
                expect(output.state.highlightedIndex).toEqual(0);
                TestUtils.Simulate.change(output.refs.input, {target: {value: ''}});
                then(() => {
                    expect(output.state.highlightedIndex).toBe(null);
                    done();
                }, 150);
            }, 150);
        });

    });

    describe('keyDownHandlers', () => {

        it('calls onBlur when we select an item with Enter', () => {
            const onTouchTapSpy = expect.createSpy();
            const onBlurSpy = expect.createSpy();
            const sections = [new Section([{onTouchTap: onTouchTapSpy}])];
            const { output } = setup({sections, onBlur: onBlurSpy});
            // select the first item
            TestUtils.Simulate.keyDown(output.refs.input, {key: 'ArrowDown'});
            // select item with enter
            TestUtils.Simulate.keyDown(output.refs.input, {key: 'Enter'});

            expect(onTouchTapSpy.calls.length).toBe(1, 'Should have triggered onTouchTap');
            expect(onBlurSpy.calls.length).toBe(1, 'Should have triggered onBlur');
        });

    });

    describe('item onTouchTap', () => {

        it('triggers an onBlur', () => {
            const onTouchTapSpy = expect.createSpy();
            const onBlurSpy = expect.createSpy();
            const sections = [new Section([{onTouchTap: onTouchTapSpy}])];
            const { output } = setup({sections, onBlur: onBlurSpy});
            const item = TestUtils.findRenderedComponentWithType(output, ListItem);
            item.props.onTouchTap();
            expect(onTouchTapSpy.calls.length).toEqual(1, 'Should have triggered onTouchTap for item');
            expect(onBlurSpy.calls.length).toEqual(1, 'Should have triggered onBlur when item is selected');
        });
    });

});

import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import componentWithContext from '../../componentWithContext';
import { AutoComplete } from '../../../src/common/components/AutoComplete';
import List from '../../../src/common/components/Search/List';
import Section from '../../../src/common/components/Search/Section';

function setup(overrides) {
    const defaults = {
        dispatch: expect.createSpy(),
    };
    const props = Object.assign({}, defaults, overrides);
    const Container = componentWithContext(<AutoComplete {...props} />);
    const container = TestUtils.renderIntoDocument(<Container />);
    const output = TestUtils.findRenderedComponentWithType(container, AutoComplete);
    return {props, output};
}

describe('AutoComplete', () => {

    it('doesn\'t render any results if no defaults are present and query is empty', () => {
        const { output } = setup();
        const lists = TestUtils.scryRenderedComponentsWithType(output, List);
        expect(lists.length).toEqual(0);
    });

    it('renders the search trigger if a query is present', () => {
        const { output } = setup();
        const input = TestUtils.findRenderedDOMComponentWithTag(output, 'input');
        TestUtils.Simulate.change(input, {target: {value: 'a'}});
        const lists = TestUtils.scryRenderedComponentsWithType(output, List);
        expect(lists.length).toEqual(2);
    });

    it('renders any defaults provided', () => {
        const defaults = [new Section([{}]), new Section([{}])];
        const { output } = setup({defaults: defaults});
        const lists = TestUtils.scryRenderedComponentsWithType(output, List);
        expect(lists.length).toEqual(2);
    });

    it('clears the query on escape', () => {
        const { output } = setup();
        const input = TestUtils.findRenderedDOMComponentWithTag(output, 'input');
        TestUtils.Simulate.change(input, {target: {value: 'a'}});
        expect(output.state.query).toEqual('a');
        TestUtils.Simulate.keyDown(input, {key: 'Escape'});
        expect(output.state.query).toEqual('');
    });

});

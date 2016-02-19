import { shallow } from 'enzyme';
import expect from 'expect';
import React from 'react';

import Tab from '../../../src/common/components/Tab';
import Tabs, { SelectableList } from '../../../src/common/components/Tabs';

import { getCustomTheme } from '../../../src/common/styles/theme';

function setup(propOverrides) {
    const children = getTabs(2);
    const props = {
        children,
        onRequestChange: expect.createSpy(),
        ...propOverrides,
    };
    const wrapper = shallow(
        <Tabs {...props} />,
        {context: {muiTheme: getCustomTheme(global.navigator.userAgent)}},
    );
    return {props, wrapper};
}

function getTabs(number) {
    const tabs = [];
    for (let i = 0; i < number; i++) {
        tabs.push(<Tab label={`tab ${i}`} value={i} />);
    }
    return tabs;
};

describe('Tabs', () => {

    it('supports rendering Tab components', () => {
        const { wrapper, props: { children }} = setup();
        expect(wrapper.find(Tab).length).toEqual(children.length);
    });

    it('renders the Tabs horizontally', () => {
        const { wrapper } = setup();
        expect(wrapper.find(SelectableList).props().style.display).toEqual('flex');
    });

});

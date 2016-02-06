import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import Tab from '../../../src/common/components/Tab';
import Tabs from '../../../src/common/components/Tabs';
import TeamDetailTabs, { SLUGS } from '../../../src/common/components/TeamDetailTabs';

function setup(propsOverrides) {
    const props = {
        ...propsOverrides,
    };
    const wrapper = shallow(<TeamDetailTabs {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('TeamDetailTabs', () => {

    it('has the correct tabs', () => {
        const { wrapper } = setup();
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(1);

        expect(tabs.nodes[0].props.label).toEqual('About');
    });

    describe('slug', () => {

        it('activates the "ABOUT" tab when the about slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.about});
            const tabs = wrapper.find(Tabs);
            expect(tabs.props().value).toEqual(SLUGS.about);
        });

    });

});

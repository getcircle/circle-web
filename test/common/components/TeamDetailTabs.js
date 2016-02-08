import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import Tab from '../../../src/common/components/Tab';
import Tabs from '../../../src/common/components/Tabs';
import TeamDetailTabs, { SLUGS } from '../../../src/common/components/TeamDetailTabs';

import TeamFactory from '../../factories/TeamFactory';

function setup(propsOverrides) {
    const team = TeamFactory.getTeam();
    const props = {
        team,
        ...propsOverrides,
    };
    const history = {
        pushState: expect.createSpy(),
        replaceState: expect.createSpy(),
    };
    const wrapper = shallow(<TeamDetailTabs {...props} />, {context: {history: history}});
    return {
        history,
        props,
        wrapper,
    };
}

describe('TeamDetailTabs', () => {

    it('has the correct tabs', () => {
        const { wrapper } = setup();
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(2);

        expect(tabs.nodes[0].props.label).toEqual('People');
        expect(tabs.nodes[1].props.label).toEqual('About');
    });

    describe('slug', () => {

        it('activates the "ABOUT" tab when the about slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.ABOUT});
            const tabs = wrapper.find(Tabs);
            expect(tabs.props().value).toEqual(SLUGS.ABOUT);
        });

        it('activates the "PEOPLE" tab when the people slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.PEOPLE});
            const tabs = wrapper.find(Tabs);
            expect(tabs.props().value).toEqual(SLUGS.PEOPLE);
        });

    });

    describe('requestChange', () => {

        it('is called when a tab is selected', () => {
            const { wrapper, history } = setup({slug: SLUGS.PEOPLE});
            const tabs = wrapper.find(Tabs);
            tabs.simulate('requestChange', {}, SLUGS.ABOUT);
            expect(history.replaceState.calls.length).toEqual(1);
            expect(history.replaceState.calls[0].arguments[1].endsWith(SLUGS.ABOUT));
            tabs.simulate('requestChange', {}, SLUGS.PEOPLE);
            expect(history.replaceState.calls.length).toEqual(2);
            expect(history.replaceState.calls[0].arguments[1].endsWith(SLUGS.PEOPLE));
        });

    });

});

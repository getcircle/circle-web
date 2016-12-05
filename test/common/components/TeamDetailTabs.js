import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import Tab from '../../../src/common/components/Tab';
import DetailTabs from '../../../src/common/components/DetailTabs';
import TeamDetailTabs, { SLUGS } from '../../../src/common/components/TeamDetailTabs';

import TeamFactory from '../../factories/TeamFactory';

function setup(propsOverrides) {
    const team = TeamFactory.getTeam();
    const props = {
        team,
        onRequestChange: expect.createSpy(),
        ...propsOverrides,
    };
    const store = {
        dispatch: expect.createSpy(),
    };
    const wrapper = shallow(<TeamDetailTabs {...props} />, {context: {store}});
    return {
        store,
        props,
        wrapper,
    };
}

describe('TeamDetailTabs', () => {

    it('has the correct tabs', () => {
        const { wrapper } = setup();
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(3);

        expect(tabs.nodes[0].props.label).toEqual('Collections');
        expect(tabs.nodes[1].props.label).toEqual('People');
        expect(tabs.nodes[2].props.label).toEqual('About');
    });

    describe('slug', () => {

        it('activates the "ABOUT" tab when the about slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.ABOUT});
            const tabs = wrapper.find(DetailTabs);
            expect(tabs.props().slug).toEqual(SLUGS.ABOUT);
        });

        it('activates the "PEOPLE" tab when the people slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.PEOPLE});
            const tabs = wrapper.find(DetailTabs);
            expect(tabs.props().slug).toEqual(SLUGS.PEOPLE);
        });

        it('activates the "COLLECTIONS" tab when the collection slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.COLLECTION});
            const tabs = wrapper.find(DetailTabs);
            expect(tabs.props().slug).toEqual(SLUGS.COLLECTION);
        });

    });

    describe('requestChange', () => {

        it('is called when a tab is selected', () => {
            const { wrapper, props: { onRequestChange } } = setup({slug: SLUGS.PEOPLE});
            const tabs = wrapper.find(DetailTabs);
            tabs.simulate('requestChange', {}, SLUGS.ABOUT);
            expect(onRequestChange.calls.length).toEqual(1);
            expect(onRequestChange.calls[0].arguments[1].endsWith(SLUGS.ABOUT));
            tabs.simulate('requestChange', {}, SLUGS.PEOPLE);
            expect(onRequestChange.calls.length).toEqual(2);
            expect(onRequestChange.calls[0].arguments[1].endsWith(SLUGS.PEOPLE));
        });

    });

});

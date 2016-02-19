import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import Tab from '../../../src/common/components/Tab';
import DetailTabs from '../../../src/common/components/DetailTabs';
import ProfileDetailTabs, { SLUGS } from '../../../src/common/components/ProfileDetailTabs';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propsOverrides) {
    const profile = ProfileFactory.getProfile();
    const props = {
        profile,
        onRequestChange: expect.createSpy(),
        ...propsOverrides,
    };
    const store = {
        dispatch: expect.createSpy(),
    };
    const wrapper = shallow(<ProfileDetailTabs {...props} />, {context: {store}});
    return {
        store,
        props,
        wrapper,
    };
}

describe('ProfileDetailTabs', () => {

    it('has the correct tabs', () => {
        const { wrapper } = setup();
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(2);

        expect(tabs.nodes[0].props.label).toEqual('Knowledge');
        expect(tabs.nodes[1].props.label).toEqual('About');
    });

    describe('slug', () => {

        it('activates the "ABOUT" tab when the about slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.ABOUT});
            const tabs = wrapper.find(DetailTabs);
            expect(tabs.props().slug).toEqual(SLUGS.ABOUT);
        });

        it('activates the "KNOWLEDGE" tab when the people slug is present', () => {
            const { wrapper } = setup({slug: SLUGS.KNOWLEDGE});
            const tabs = wrapper.find(DetailTabs);
            expect(tabs.props().slug).toEqual(SLUGS.KNOWLEDGE);
        });

    });

    describe('requestChange', () => {

        it('is called when a tab is selected', () => {
            const { wrapper, props: { onRequestChange } } = setup({slug: SLUGS.KNOWLEDGE});
            const tabs = wrapper.find(DetailTabs);
            tabs.simulate('requestChange', {}, SLUGS.ABOUT);
            expect(onRequestChange.calls.length).toEqual(1);
            expect(onRequestChange.calls[0].arguments[1].endsWith(SLUGS.ABOUT));
            tabs.simulate('requestChange', {}, SLUGS.KNOWLEDGE);
            expect(onRequestChange.calls.length).toEqual(2);
            expect(onRequestChange.calls[0].arguments[1].endsWith(SLUGS.KNOWLEDGE));
        });

    });

});

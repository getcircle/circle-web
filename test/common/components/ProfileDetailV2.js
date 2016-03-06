import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import ProfileDetail from '../../../src/common/components/ProfileDetailV2';
import ProfileDetailHeader from '../../../src/common/components/ProfileDetailHeaderV2';
import ProfileDetailTabs, { SLUGS } from '../../../src/common/components/ProfileDetailTabs';
import AuthContextFactory from '../../factories/AuthContextFactory';
import { getDefaultContext } from '../../componentWithContext';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propsOverrides, profileOverrides) {
    const params = {
        ...profileOverrides,
    };
    const profile = ProfileFactory.getProfile(params);

    const props = {
        dispatch: expect.createSpy(),
        hasMorePosts: false,
        profile,
        coordinators: [],
        ...propsOverrides,
    };

    const auth = AuthContextFactory.getContext(undefined, undefined, profile);
    const context = getDefaultContext({auth});
    const wrapper = shallow(<ProfileDetail {...props} />, { context });
    return {
        props,
        wrapper,
    };
}

describe('ProfileDetail', () => {

    it('renders the ProfileDetailHeader', () => {
        const { wrapper, props: { profile }} = setup();
        expect(wrapper.find(ProfileDetailHeader).props().profile).toBe(profile);
    });

    describe('ProfileDetailsTab', () => {

        it('renders with "Knowledge" as the default', () => {
            const { wrapper } = setup();
            expect(wrapper.find(ProfileDetailTabs).props().slug).toEqual(SLUGS.KNOWLEDGE);
        });

        it('renders the "About" section if provided the correct slug', () => {
            const { wrapper } = setup({slug: SLUGS.ABOUT});
            expect(wrapper.find(ProfileDetailTabs).props().slug).toEqual(SLUGS.ABOUT);
        });

    });

});

import expect from 'expect';
import { mount } from 'enzyme';
import React from 'react';

import { ListItem } from 'material-ui';

import DetailListItemProfile from '../../../src/common/components/DetailListItemProfile';
import ProfileAvatar from '../../../src/common/components/ProfileAvatar';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propOverrides) {
    const profile = ProfileFactory.getProfile();
    const props = {
        dispatch: expect.createSpy(),
        profile,
        ...propOverrides,
    };

    const wrapper = mount(<DetailListItemProfile {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('DetailListItemProfile', () => {

    it('renders a ListItem with appropriate props', () => {
        const { wrapper, props: { profile } } = setup();
        const props = wrapper.find(ListItem).props();
        expect(props.leftAvatar.type).toBe(ProfileAvatar);
        expect(props.leftAvatar.props.profile).toEqual(profile);
        expect(props.primaryText.props.children).toEqual(profile.full_name);
        expect(props.secondaryText.props.children).toEqual(profile.title);
    });

});

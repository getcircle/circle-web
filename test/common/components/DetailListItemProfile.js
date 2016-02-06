import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { ListItem } from 'material-ui';

import DetailListItemProfile from '../../../src/common/components/DetailListItemProfile';
import ProfileAvatar from '../../../src/common/components/ProfileAvatar';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propOverrides) {
    const profile = ProfileFactory.getProfile();
    const props = {
        profile,
        ...propOverrides,
    };

    const wrapper = shallow(<DetailListItemProfile {...props} />);
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
        expect(props.primaryText).toEqual(profile.full_name);
        expect(props.secondaryText).toEqual(profile.title);
    });

});

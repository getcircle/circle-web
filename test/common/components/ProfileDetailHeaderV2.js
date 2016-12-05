import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import DetailHeader from '../../../src/common/components/DetailHeader';
import ProfileDetailHeader from '../../../src/common/components/ProfileDetailHeaderV2';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propsOverrides) {
    const props = {
        ...propsOverrides,
    };
    const wrapper = shallow(<ProfileDetailHeader {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('ProfileDetailHeader', () => {

    it('handles not having a profile', () => {
        const { wrapper } = setup();
        expect(wrapper.find(DetailHeader).length).toEqual(1);
    });

    it('handles loading a profile', () => {
        const { wrapper, props: { profile } } = setup({profile: ProfileFactory.getProfile()});
        const header = wrapper.find(DetailHeader)
        expect(header.length).toEqual(1);
        expect(header.prop('primaryText')).toEqual(profile.full_name);
        expect(header.prop('secondaryText')).toEqual(profile.title);
    });

});

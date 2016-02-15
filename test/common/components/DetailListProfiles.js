import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import DetailListProfiles from '../../../src/common/components/DetailListProfiles';
import DetailListItemProfile from '../../../src/common/components/DetailListItemProfile';

import ProfileFactory from '../../factories/ProfileFactory';

function setup(propOverrides) {
    const props = {
        ...propOverrides,
    };

    const wrapper = shallow(<DetailListProfiles {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('DetailListProfiles', () => {

    it('renders a single profile in a List', () => {
        const profiles = ProfileFactory.getProfiles(1);
        const { wrapper } = setup({profiles});
        expect(wrapper.find(DetailListItemProfile).length).toEqual(1);
    });

});

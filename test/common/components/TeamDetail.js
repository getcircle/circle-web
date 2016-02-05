import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import TeamDetail from '../../../src/common/components/TeamDetail';
import TeamDetailHeader from '../../../src/common/components/TeamDetailHeader';

import TeamFactory from '../../factories/TeamFactory';

function setup(propsOverrides, teamOverrides) {
    const params = {
        ...teamOverrides,
    };
    const team = TeamFactory.getTeam(params);

    const props = {
        team,
        ...propsOverrides,
    };
    const wrapper = shallow(<TeamDetail {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('TeamDetail', () => {

    it('renders the TeamDetailHeader', () => {
        const { wrapper, props: { team }} = setup();
        expect(wrapper.find(TeamDetailHeader).props().team).toBe(team);
    });

});

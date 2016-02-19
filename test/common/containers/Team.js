import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { Team } from '../../../src/common/containers/Team';
import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import TeamDetail from '../../../src/common/components/TeamDetail';

import TeamFactory from '../../factories/TeamFactory';

function setup(propsOverrides) {
    const props = {
        dispatch: expect.createSpy(),
        params: {teamId: '123'},
        ...propsOverrides,
    };
    const wrapper = shallow(<Team {...props} />);
    return {
        props,
        wrapper,
    }
}

describe('Team Container', () => {

    it('renders a loading indicator if no team is provided', () => {
        const { wrapper } = setup();
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders the TeamDetail if a team is provided', () => {
        const team = TeamFactory.getTeam();
        const { wrapper } = setup({team, params: {teamId: team.id}});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(0);
        expect(wrapper.find(TeamDetail).length).toEqual(1);
    });

});

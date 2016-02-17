import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { IconButton } from 'material-ui';

import { getCustomTheme } from '../../../../src/common/styles/theme';
import { showTeamEditModal } from '../../../../src/common/actions/teams';

import DetailSection from '../../../../src/common/components/DetailSectionV2';
import DetailListProfiles from '../../../../src/common/components/DetailListProfiles';
import TeamDetailAbout from '../../../../src/common/components/TeamDetailAbout';

import TeamFactory from '../../../factories/TeamFactory';

function setup(propsOverrides, teamOverrides, hasPermissions) {
    const params = {
        ...teamOverrides,
    };
    const team = TeamFactory.getTeam(params, hasPermissions);

    const props = {
        dispatch: expect.createSpy(),
        team,
        ...propsOverrides,
    };
    const wrapper = shallow(
        <TeamDetailAbout {...props} />,
        { context: { muiTheme: getCustomTheme(global.navigator.userAgent)}},
    );
    return {
        props,
        wrapper,
    };
}

describe('TeamDetailAbout', () => {

    it('renders the "About" heading', () => {
        const { wrapper } = setup();
        expect(wrapper.find('h1').text()).toEqual('About');
    });

    describe('edit button', () => {

        it('is shown when the user has edit permissions', () => {
            const { wrapper } = setup({}, undefined, false);
            expect(wrapper.find(IconButton).length).toBe(1);
        });

        it('is not shown when the user does not have edit permissions', () => {
            const { wrapper } = setup({}, undefined, true);
            expect(wrapper.find(IconButton).length).toBe(0);
        });

        it('onTouchTap dispatches the show modal action', () => {
            const dispatchSpy = expect.createSpy();
            const { wrapper } = setup({dispatch: dispatchSpy});
            wrapper.find(IconButton).prop('onTouchTap')();
            const action = showTeamEditModal();
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });

    });

    describe('coordinators section', () => {

        it('only renders if coordinators are provided', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DetailSection).length).toEqual(0);
        });

        it('renders the coordinators section if they\'re provided', () => {
            const coordinators = TeamFactory.getCoordinators(2);
            const { wrapper } = setup({ coordinators });
            expect(wrapper.find(DetailSection).at(0).props().title).toEqual('Coordinators');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
        });

    });

});

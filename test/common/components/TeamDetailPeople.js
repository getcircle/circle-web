import { shallow } from 'enzyme';
import expect from 'expect';
import React from 'react';

import { getCustomTheme } from '../../../src/common/styles/theme';

import DetailSection from '../../../src/common/components/DetailSectionV2';
import InfiniteProfilesGrid from '../../../src/common/components/InfiniteProfilesGrid';
import ProfilesGrid from '../../../src/common/components/ProfilesGrid';
import TeamDetailPeople from '../../../src/common/components/TeamDetailPeople';

import DeviceContextFactory from '../../factories/DeviceContextFactory';
import TeamFactory from '../../factories/TeamFactory';

function setup(propOverrides) {
    const coordinators = TeamFactory.getCoordinators(2);
    const team = TeamFactory.getTeam();
    const props = {
        coordinators,
        dispatch: expect.createSpy(),
        hasMoreMembers: false,
        team,
        ...propOverrides,
    };
    const wrapper = shallow(
        <TeamDetailPeople {...props} />,
        { context: { muiTheme: getCustomTheme(global.navigator.userAgent), device: DeviceContextFactory.getContext()}},
    );
    return {props, wrapper};
};

describe('TeamDetailPeople', () => {

    it('renders the "People" heading', () => {
        const { wrapper } = setup();
        expect(wrapper.find('h1').text()).toEqual('People');
    });

    describe('coordinators', () => {

        it('renders the "Coordinators" header', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DetailSection).at(0).props().title).toEqual('Coordinators');
        });

        it('renders a ProfilesGrid with the coordinators', () => {
            const { wrapper, props: { coordinators }} = setup();
            expect(wrapper.find(ProfilesGrid).at(0).props().profiles.length).toEqual(coordinators.length);
        });

        it('doesn\'t render the "Coordinators" section if we don\'t have coordinators yet', () => {
            const { wrapper } = setup({coordinators: []});
            expect(wrapper.find(DetailSection).length).toEqual(0);
            expect(wrapper.find(ProfilesGrid).length).toEqual(0);
        });
    });

    describe('members', () => {

        it('doesn\'t render the "Members" section if we don\'t have members yet', () => {
            const { wrapper } = setup({members: []});
            expect(wrapper.find(DetailSection).length).toEqual(1);
            expect(wrapper.find(InfiniteProfilesGrid).length).toEqual(0);
        });

        it('renders the "Members" header', () => {
            const members = TeamFactory.getMembers(5);
            const { wrapper } = setup({members});
            expect(wrapper.find(DetailSection).at(1).props().title).toEqual('Members');
        });

        it('renders a InfiniteProfilesGrid with the members', () => {
            const members = TeamFactory.getMembers(5);
            const { wrapper } = setup({members});
            expect(wrapper.find(InfiniteProfilesGrid).length).toEqual(1);
        });

    });

});

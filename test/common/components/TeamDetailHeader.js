import expect from 'expect';
import { mount } from 'enzyme';
import { services } from 'protobufs';
import React from 'react';

import IconContainer from '../../../src/common/components/IconContainer';
import GroupIcon from '../../../src/common/components/GroupIcon';
import TeamDetailHeader from '../../../src/common/components/TeamDetailHeader';

import componentWithContext from '../../componentWithContext';
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
    const Container = componentWithContext(<TeamDetailHeader {...props} />);
    const wrapper = mount(<Container />);
    return {
        props,
        wrapper,
    };
}

describe('TeamDetailHeader', () => {

    it('displays the team name', () => {
        const { wrapper, props: { team } } = setup();
        const html = wrapper.html();
        expect(html).toInclude(team.name);
        expect(html).toExclude('Coordinated by', 'Shouldn\'t display "Coordinated by" unless we have coordinators');
    });

    it('displays the group icon', () => {
        const { wrapper } = setup();
        expect(wrapper.find(IconContainer).props().IconClass).toEqual(GroupIcon);
    });

    describe('coordinator details', () => {

        it('displays correctly with 1 coordinator', () => {
            const coordinators = TeamFactory.getMembers(1, services.team.containers.TeamMemberV1.RoleV1.COORDINATOR);
            const { wrapper } = setup({coordinators});
            const html = wrapper.html();
            expect(html).toInclude('Coordinated by');
            expect(wrapper.find('a').length).toEqual(1);
            expect(html).toInclude(coordinators[0].profile.full_name);
        });

        it('displays correctly with 2 coordinators', () => {
            const coordinators = TeamFactory.getMembers(2, services.team.containers.TeamMemberV1.RoleV1.COORDINATOR);
            const { wrapper } = setup({coordinators});
            const html = wrapper.html();
            expect(html).toInclude('Coordinated by');
            expect(wrapper.find('a').length).toEqual(2);
        });

        it('displays correctly with 3 coordinators', () => {
            const coordinators = TeamFactory.getMembers(3, services.team.containers.TeamMemberV1.RoleV1.COORDINATOR);
            const { wrapper } = setup({coordinators});
            const html = wrapper.html();
            expect(html).toInclude('Coordinated by');
            expect(wrapper.find('a').length).toEqual(3);
        });

    });

});

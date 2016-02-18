import expect from 'expect';
import { mount } from 'enzyme';
import React from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import DetailListItemTeamMembership from '../../../src/common/components/DetailListItemTeamMembership';

import TeamFactory from '../../factories/TeamFactory';

function setup(propOverrides) {
    const member = TeamFactory.getTeamMember();
    const props = {
        member,
        ...propOverrides,
    };

    const wrapper = mount(<DetailListItemTeamMembership {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('DetailListItemTeamMembership', () => {

    it('renders a ListItem with appropriate props', () => {
        const { wrapper, props: { member } } = setup();
        expect(wrapper.find(ListItem).length).toEqual(1);
        const html = wrapper.html();
        expect(html).toExclude('Coordinator');
        expect(html).toInclude(member.team.name);
    });

    it('renders a ListItem with Coordinator in the content', () => {
        const member = TeamFactory.getTeamMember(services.team.containers.TeamMemberV1.RoleV1.COORDINATOR);
        const { wrapper } = setup({ member });
        expect(wrapper.find(ListItem).length).toEqual(1);
        const html = wrapper.html();
        expect(html).toInclude('Coordinator');
        expect(html).toInclude(member.team.name);
    });

});

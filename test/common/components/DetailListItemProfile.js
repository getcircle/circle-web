import expect from 'expect';
import { mount } from 'enzyme';
import React from 'react';

import { ListItem } from 'material-ui';

import DetailListItemTeamMinimal from '../../../src/common/components/DetailListItemTeamMinimal';

import TeamFactory from '../../factories/TeamFactory';

function setup(propOverrides) {
    const team = TeamFactory.getTeam();
    const props = {
        team,
        ...propOverrides,
    };

    const wrapper = mount(<DetailListItemTeamMinimal {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('DetailListItemTeamMinimal', () => {

    it('renders a ListItem with appropriate props', () => {
        const { wrapper, props: { team } } = setup();
        expect(wrapper.find(ListItem).length).toEqual(1);
        const html = wrapper.html();
        expect(html).toExclude('Coordinator');
        expect(html).toInclude(team.name);
    });

});

import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import TeamDetail from '../../../src/common/components/TeamDetail';
import TeamDetailAbout from '../../../src/common/components/TeamDetailAbout';
import TeamDetailHeader from '../../../src/common/components/TeamDetailHeader';
import TeamDetailPeople from '../../../src/common/components/TeamDetailPeople';
import TeamDetailTabs, { SLUGS } from '../../../src/common/components/TeamDetailTabs';

import TeamFactory from '../../factories/TeamFactory';

function setup(propsOverrides, teamOverrides) {
    const params = {
        ...teamOverrides,
    };
    const team = TeamFactory.getTeam(params);

    const props = {
        team,
        coordinators: [],
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

    describe('TeamDetailsTab', () => {

        it('renders with "People" as the default', () => {
            const { wrapper } = setup();
            expect(wrapper.find(TeamDetailTabs).props().slug).toEqual(SLUGS.PEOPLE);
            expect(wrapper.find(TeamDetailPeople).length).toEqual(1);
        });

    });

});

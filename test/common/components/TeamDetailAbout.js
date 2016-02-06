import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import DetailListProfiles from '../../../src/common/components/DetailListProfiles';
import TeamDetailAbout from '../../../src/common/components/TeamDetailAbout';

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
    const wrapper = shallow(<TeamDetailAbout {...props} />);
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

    describe('description section', () => {

        it('has a header', () => {
            const { wrapper } = setup();
            expect(wrapper.find('h2').at(0).text()).toEqual('Description');
        });

        it('renders the team description', () => {
            const { wrapper, props } = setup();
            expect(wrapper.text()).toInclude(props.team.description.value);
        });

    });

    describe('coordinators section', () => {

        it('only renders if coordinators are provided', () => {
            const { wrapper } = setup();
            expect(wrapper.find('h2').length).toEqual(1);
        });

        it('renders the coordinators section if they\'re provided', () => {
            const coordinators = TeamFactory.getTeamCoordinators(2);
            const { wrapper } = setup({ coordinators });
            expect(wrapper.find('h2').at(1).text()).toEqual('Coordinators');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
        });

    });

});

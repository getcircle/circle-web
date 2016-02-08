import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { getCustomTheme } from '../../../src/common/styles/theme';

import DetailSection from '../../../src/common/components/DetailSectionV2';
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

    describe('description section', () => {

        it('has a header', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DetailSection).at(0).props().title).toEqual('Description');
        });

        it('renders the team description', () => {
            const { wrapper, props } = setup();
            expect(wrapper.find('p').text()).toInclude(props.team.description.value);
        });

    });

    describe('coordinators section', () => {

        it('only renders if coordinators are provided', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DetailSection).length).toEqual(1);
        });

        it('renders the coordinators section if they\'re provided', () => {
            const coordinators = TeamFactory.getCoordinators(2);
            const { wrapper } = setup({ coordinators });
            expect(wrapper.find(DetailSection).at(1).props().title).toEqual('Coordinators');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
        });

    });

});

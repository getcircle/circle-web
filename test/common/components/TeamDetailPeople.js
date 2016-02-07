import { shallow } from 'enzyme';
import expect from 'expect';
import React from 'react';

import { getCustomTheme } from '../../../src/common/styles/theme';

import DetailSection from '../../../src/common/components/DetailSectionV2';
import ProfilesGrid from '../../../src/common/components/ProfilesGrid';
import TeamDetailPeople from '../../../src/common/components/TeamDetailPeople';

import TeamFactory from '../../factories/TeamFactory';

function setup(propOverrides) {
    const coordinators = TeamFactory.getCoordinators(2);
    const props = {
        coordinators,
        ...propOverrides,
    };
    const wrapper = shallow(
        <TeamDetailPeople {...props} />,
        { context: { muiTheme: getCustomTheme(global.navigator.userAgent)}},
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

});

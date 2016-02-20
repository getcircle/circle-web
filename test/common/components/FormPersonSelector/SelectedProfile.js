import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import DownChevronIcon from '../../../../src/common/components/DownChevronIcon';
import ProfileFactory from '../../../factories/ProfileFactory';
import SelectedProfile from '../../../../src/common/components/FormPersonSelector/SelectedProfile';
import UpChevronIcon from '../../../../src/common/components/UpChevronIcon';

function setup(overrides) {
    const defaults = {
        expanded: false,
        onHoverChange: expect.createSpy(),
        onTouchTap: expect.createSpy(),
    };
    const props = Object.assign({}, defaults, overrides);

    const wrapper = shallow(<SelectedProfile {...props} />);

    return {
        props,
        wrapper,
    };
}

describe('SelectedProfile', () => {

    describe('name', () => {

        it('is empty if there is no profile', () => {
            const { wrapper } = setup();
            expect(wrapper.children().at(0).text()).toEqual('');
        });

        it('shows only the name when there is no title' , () => {
            const profile = ProfileFactory.getProfile({
                /*eslint-disable camelcase*/
                full_name: 'Joe User',
                title: undefined,
                /*eslint-enable camelcase*/
            });
            const { wrapper } = setup({profile});
            expect(wrapper.children().at(0).text()).toEqual('Joe User');
        });

        it('shows the profile name and title for a profile that has them', () => {
            const profile = ProfileFactory.getProfile({
                /*eslint-disable camelcase*/
                full_name: 'Joe User',
                title: 'CEO',
                /*eslint-enable camelcase*/
            });
            const { wrapper } = setup({profile});
            expect(wrapper.children().at(0).text()).toEqual('Joe User (CEO)');
        });

    });

    describe('icon', () => {

        it('is a down chevron if the field is not expanded', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DownChevronIcon).length).toBe(1);
        });

        it('is an up chevron if the field is expanded', () => {
            const { wrapper } = setup({expanded: true});
            expect(wrapper.find(UpChevronIcon).length).toBe(1);
        });

    });

    describe('hovering', () => {

        it('calls onHoverChange with true when the mouse enters', () => {
            const { wrapper, props } = setup();
            wrapper.prop('onMouseEnter')();
            expect(props.onHoverChange).toHaveBeenCalledWith(true);
        });

        it('calls onHoverChange with false when the mouse leaves', () => {
            const { wrapper, props } = setup();
            wrapper.prop('onMouseLeave')();
            expect(props.onHoverChange).toHaveBeenCalledWith(false);
        });

    });

});

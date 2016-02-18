import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import AutoCompleteProfile from '../../../../src/common/components/AutoCompleteProfile';
import { getDefaultContext } from '../../../componentWithContext';
import ProfileFactory from '../../../factories/ProfileFactory';
import FormPersonSelector from '../../../../src/common/components/FormPersonSelector';
import SelectedProfile from '../../../../src/common/components/FormPersonSelector/SelectedProfile';

function setup(overrides) {
    const defaults = {
        onBlur: expect.createSpy(),
        onChange: expect.createSpy(),
        onFocus: expect.createSpy(),
    };
    const props = Object.assign({}, defaults, overrides);
    const context = getDefaultContext();

    const wrapper = shallow(<FormPersonSelector {...props} />, {context});

    return {
        props,
        wrapper,
    };
}

describe('FormPersonSelector', () => {

    describe('onTouchTap of the selected profile', () => {

        it('expands if it was previously collapsed', () => {
            const { wrapper } = setup();
            wrapper.find(SelectedProfile).prop('onTouchTap')();
            expect(wrapper.update().find(AutoCompleteProfile).length).toBe(1);
        });

        it('collapses if it was previously expanded', () => {
            const { wrapper } = setup();
            wrapper.setState({expanded: true});
            wrapper.find(SelectedProfile).prop('onTouchTap')();
            expect(wrapper.update().find(AutoCompleteProfile).length).toBe(0);
        });

    });

    describe('selecting a profile', () => {

        it('calls onChange with the new profile', () => {
            const { wrapper, props } = setup();
            const profile = ProfileFactory.getProfile();
            wrapper.find(SelectedProfile).prop('onTouchTap')();
            wrapper.update();
            wrapper.find(AutoCompleteProfile).prop('onSelectProfile')(profile);
            expect(props.onChange).toHaveBeenCalledWith(profile);
        });

        it('collapses', () => {
            const { wrapper } = setup();
            const profile = ProfileFactory.getProfile();
            wrapper.find(SelectedProfile).prop('onTouchTap')();
            wrapper.update();
            wrapper.find(AutoCompleteProfile).prop('onSelectProfile')(profile);
            wrapper.update();
            expect(wrapper.find(AutoCompleteProfile).length).toBe(0);
        });

    });

});

import expect from 'expect';
import React from 'react';
import { DropDownMenu } from 'material-ui';
import { shallow } from 'enzyme';

import * as formBehaviors from './formBehaviors';

import FormSelectField from '../../../src/common/components/FormSelectField';
import { getDefaultContext } from '../../componentWithContext';

function setup(overrides) {
    const defaults = {
        choices: [
            {label: 'One', value: 'one'},
            {label: 'Two', value: 'two'},
        ],
        invalid: true,
        name: 'field-name',
        onChange: expect.createSpy(),
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);
    const context = getDefaultContext();

    const wrapper = shallow(<FormSelectField {...props} />, {context});

    return {
        props,
        wrapper,
    };
}

describe('FormSelectField', () => {

    describe('validation errors', () => {

        context('when valid', () => {
            const { wrapper } = setup();
            formBehaviors.itDoesNotShowError(wrapper.find(DropDownMenu));
        });

        context('when invalid but not touched', () => {
            const { wrapper } = setup({invalid: true, touched: false});
            formBehaviors.itDoesNotShowError(wrapper.find(DropDownMenu));
        });

        context('when invalid and touched', () => {
            const { wrapper } = setup({invalid: true, touched: true});
            formBehaviors.itShowsError(wrapper.find(DropDownMenu));
        });

    });

    describe('onChange', () => {

        it('is called when the select field changes', () => {
            const onChangeSpy = expect.createSpy();
            const { wrapper } = setup({onChange: onChangeSpy});
            wrapper.find(DropDownMenu).prop('onChange')(null, null, 'val-0');
            expect(onChangeSpy).toHaveBeenCalled();
        });

    });

});

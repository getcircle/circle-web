import expect from 'expect';
import React from 'react';
import { SelectField } from 'material-ui';
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
            formBehaviors.itDoesNotShowError(wrapper.find(SelectField));
        });

        context('when invalid but not touched', () => {
            const { wrapper } = setup({invalid: true, touched: false});
            formBehaviors.itDoesNotShowError(wrapper.find(SelectField));
        });

        context('when invalid and touched', () => {
            const { wrapper } = setup({invalid: true, touched: true});
            formBehaviors.itShowsError(wrapper.find(SelectField));
        });

    });

    describe('onChange', () => {

        it('is called when the select field changes', () => {
            const onChangeSpy = expect.createSpy();
            const { wrapper } = setup({onChange: onChangeSpy});
            wrapper.find(SelectField).prop('onChange')();
            expect(onChangeSpy).toHaveBeenCalled();
        });

    });

});

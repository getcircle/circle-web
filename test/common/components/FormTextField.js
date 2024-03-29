import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import * as formBehaviors from './formBehaviors';

import FormTextField from '../../../src/common/components/FormTextField';
import { getDefaultContext } from '../../componentWithContext';

function setup(overrides) {
    const defaults = {
        invalid: true,
        onChange: expect.createSpy(),
        placeholder: 'Add your cell number',
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);
    const context = getDefaultContext();

    const wrapper = shallow(<FormTextField {...props} />, {context});

    return {
        props,
        wrapper,
    };
}

describe('FormTextField', () => {

    context('when valid', () => {
        const { wrapper } = setup();
        formBehaviors.itDoesNotShowError(wrapper.find('input'));
    });

    context('when invalid but not touched', () => {
        const { wrapper } = setup({invalid: true, touched: false});
        formBehaviors.itDoesNotShowError(wrapper.find('input'));
    });

    context('when invalid and touched', () => {
        const { wrapper } = setup({invalid: true, touched: true});
        formBehaviors.itShowsError(wrapper.find('input'));
    });

});

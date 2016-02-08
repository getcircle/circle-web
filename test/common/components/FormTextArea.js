import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import * as formBehaviors from './formBehaviors';

import FormTextArea from '../../../src/common/components/FormTextArea';

function setup(overrides) {
    const defaults = {
        invalid: true,
        onChange: expect.createSpy(),
        placeholder: 'A bunch of text',
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);

    const wrapper = shallow(<FormTextArea {...props} />);

    return {
        props,
        wrapper,
    };
}

describe('FormTextArea', () => {

    context('when valid', () => {
        const { wrapper } = setup();
        formBehaviors.itDoesNotShowError(wrapper.find('textarea'));
    });

    context('when invalid but not touched', () => {
        const { wrapper } = setup({invalid: true, touched: false});
        formBehaviors.itDoesNotShowError(wrapper.find('textarea'));
    });

    context('when invalid and touched', () => {
        const { wrapper } = setup({invalid: true, touched: true});
        formBehaviors.itShowsError(wrapper.find('textarea'));
    });

});

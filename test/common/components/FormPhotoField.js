import Dropzone from 'react-dropzone';
import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import * as formBehaviors from './formBehaviors';

import FormPhotoField from '../../../src/common/components/FormPhotoField';

function setup(overrides) {
    const defaults = {
        invalid: true,
        onChange: expect.createSpy(),
        placeholder: 'A bunch of text',
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);

    const wrapper = shallow(<FormPhotoField {...props} />);

    return {
        props,
        wrapper,
    };
}

describe('FormPhotoField', () => {

    context('when valid', () => {
        const { wrapper } = setup();
        formBehaviors.itDoesNotShowError(wrapper.find(Dropzone));
    });

    context('when invalid but not touched', () => {
        const { wrapper } = setup({invalid: true, touched: false});
        formBehaviors.itDoesNotShowError(wrapper.find(Dropzone));
    });

    context('when invalid and touched', () => {
        const { wrapper } = setup({invalid: true, touched: true});
        formBehaviors.itShowsError(wrapper.find(Dropzone));
    });

});

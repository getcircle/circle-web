import React from 'react';
import TestUtils from 'react-addons-test-utils';

import * as formBehaviors from './formBehaviors';

import FormTextArea from '../../../src/common/components/FormTextArea';

function setup(overrides) {
    const defaults = {
        invalid: true,
        placeholder: 'A bunch of text',
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<FormTextArea {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

describe('FormTextArea', () => {

    context('when valid', () => {
        const { output } = setup();
        formBehaviors.itDoesNotShowError(output);
    });

    context('when invalid but not touched', () => {
        const { output } = setup({invalid: true, touched: false});
        formBehaviors.itDoesNotShowError(output);
    });

    context('when invalid and touched', () => {
        const { output } = setup({invalid: true, touched: true});
        formBehaviors.itShowsError(output);
    });

});

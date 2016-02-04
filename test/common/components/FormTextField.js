import React from 'react';
import TestUtils from 'react-addons-test-utils';

import * as formBehaviors from './formBehaviors';

import FormTextField from '../../../src/common/components/FormTextField';

function setup(overrides) {
    const defaults = {
        invalid: true,
        placeholder: 'Add your cell number',
        touched: false,
        value: '',
    };
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<FormTextField {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

describe('FormTextField', () => {

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

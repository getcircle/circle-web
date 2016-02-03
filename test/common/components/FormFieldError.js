import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import FormFieldError from '../../../src/common/components/FormFieldError';

function setup(props) {
    let renderer = TestUtils.createRenderer();
    renderer.render(<FormFieldError {...props} />);
    return renderer.getRenderOutput();
}

describe('FormFieldError', () => {

    it('is an empty span when there is no error', () => {
        const output = setup({error: null});
        expect(output.type).toBe('span');
        expect(output.props.children).toBe(undefined);
    });

    it('shows an element with the error text when there is an error', () => {
        const output = setup({error: 'Required'});
        expect(output.type).toBe('div');
        expect(output.props.children).toBe('Required');
    });

});

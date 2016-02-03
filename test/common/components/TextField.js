import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TextField from '../../../src/common/components/TextField';

const RED_BORDER = '1px solid rgba(200, 0, 0, 0.8)';

function setup(overrides) {
    const defaults = {
        invalid: true,
        name: 'contact',
        onBlur: expect.createSpy(),
        onChange: expect.createSpy(),
        onFocus: expect.createSpy(),
        placeholder: 'Add your cell number',
        touched: false,
        value: '',
    }
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<TextField {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

function itDoesNotShowError(output) {
    it('is not highlighted in red', () => {
        const input = output.props.children[0];
        expect(input.props.style.border).toNotBe(RED_BORDER);
    });
}

function itShowsError(output) {
    it('is highlighted in red', () => {
        const input = output.props.children[0];
        expect(input.props.style.border).toBe(RED_BORDER);
    });
}

describe('TextField', () => {

    context('when valid', () => {
        const { output } = setup();
        itDoesNotShowError(output)
    });

    context('when invalid but not touched', () => {
        const { output } = setup({invalid: true, touched: false});
        itDoesNotShowError(output)
    });

    context('when invalid and touched', () => {
        const { output } = setup({invalid: true, touched: true});
        itShowsError(output)
    });

});

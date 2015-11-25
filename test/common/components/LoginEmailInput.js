import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import LoginEmailInput from '../../../src/common/components/LoginEmailInput';

function setup(overrides) {
    const defaults = {
        onChange: expect.createSpy(),
        onEnter: expect.createSpy(),
        value: '',
    }
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<LoginEmailInput {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

describe('LoginEmailInput', () => {

    describe('onChange', () => {
        it('is called whenever the TextField changes', () => {
            const { output, props } = setup();
            output.props.onChange('v');
            expect(props.onChange.calls.length).toBe(1);
            output.props.onChange('va');
            expect(props.onChange.calls.length).toBe(2);
        });
    });

    describe('onEnterKeyDown', () => {
        it('is called if a value is present', () => {
            const { output, props } = setup({value: 'me@example.com'});
            output.props.onEnterKeyDown();
            expect(props.onEnter.calls.length).toBe(1);
        });

        it('does nothing if no value is present', () => {
            const { output, props } = setup({value: ''});
            output.props.onEnterKeyDown();
            expect(props.onEnter.calls.length).toBe(0);
        });
    });

});

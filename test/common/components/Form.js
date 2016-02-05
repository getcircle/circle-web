import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Form from '../../../src/common/components/Form';

function setup(overrides = {}) {
    const defaults = {
        error: undefined,
        onSubmit: expect.createSpy(),
        submitting: false,
        warning: undefined,
    };
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<Form {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

describe('Form', () => {

    describe('progress', () => {

        it('shows a progress indicator when submitting', () => {
            const { output } = setup({submitting: true});
            const [ progress ] = output.props.children;
            expect(progress).toNotBe(undefined);
        });

        it('does not show a progress indicator when not submitting', () => {
            const { output } = setup();
            const [ progress ] = output.props.children;
            expect(progress).toBe(undefined);
        });

    });

    describe('toast', () => {

        it('shows an error toast when there is an error', () => {
            const { output } = setup({error: 'ERROR_MESSAGE'});
            const toast = output.props.children[1];
            expect(toast).toNotBe(undefined);
            expect(toast.props.messageType).toBe('ERROR');
            expect(toast.props.message).toBe('ERROR_MESSAGE');
        });

        it('shows a warning toast when there is a warning', () => {
            const { output } = setup({warning: 'WARNING_MESSAGE'});
            const toast = output.props.children[1];
            expect(toast).toNotBe(undefined);
            expect(toast.props.messageType).toBe('WARNING');
            expect(toast.props.message).toBe('WARNING_MESSAGE');
        });

        it('shows an error toast when both an error and warning are present', () => {
            const { output } = setup({error: 'ERROR_MESSAGE', warning: 'WARNING_MESSAGE'});
            const toast = output.props.children[1];
            expect(toast).toNotBe(undefined);
            expect(toast.props.messageType).toBe('ERROR');
            expect(toast.props.message).toBe('ERROR_MESSAGE');
        });

        it('shows no toast if neither an error nor warning are present', () => {
            const { output } = setup();
            const toast = output.props.children[1];
            expect(toast).toBe(undefined);
        });

    });

    describe('onSubmit', () => {

        it('is called when onSubmit is triggered for the form', () => {
            const onSubmitSpy = expect.createSpy();
            const { output } = setup({onSubmit: onSubmitSpy});
            const form = output.props.children[2];
            form.props.onSubmit();
            expect(onSubmitSpy.calls.length).toEqual(1, 'Should have called the onSubmit prop');
        });

    });

});

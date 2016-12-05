import expect from 'expect';
import { LinearProgress } from 'material-ui';
import { mount } from 'enzyme';
import React from 'react';

import Form from '../../../src/common/components/Form';
import Toast from '../../../src/common/components/Toast';

function setup(overrides = {}) {
    const defaults = {
        error: undefined,
        onSubmit: expect.createSpy(),
        submitting: false,
        warning: undefined,
    };
    const props = Object.assign({}, defaults, overrides);

    const wrapper = mount(<Form {...props} />);

    return {
        props,
        wrapper,
    };
}

describe('Form', () => {

    describe('progress', () => {

        it('shows a progress indicator when submitting', () => {
            const { wrapper } = setup({submitting: true});
            const progress = wrapper.find(LinearProgress);
            expect(progress.length).toBe(1);
        });

        it('does not show a progress indicator when not submitting', () => {
            const { wrapper } = setup({submitting: false});
            const progress = wrapper.find(LinearProgress);
            expect(progress.length).toBe(0);
        });

    });

    describe('toast', () => {

        it('shows an error toast when there is an error', () => {
            const { wrapper } = setup({error: 'ERROR_MESSAGE'});
            const toast = wrapper.find(Toast);
            expect(toast.length).toBe(1);
            expect(toast.prop('messageType')).toBe('ERROR');
            expect(toast.prop('message')).toBe('ERROR_MESSAGE');
        });

        it('shows a warning toast when there is a warning', () => {
            const { wrapper } = setup({warning: 'WARNING_MESSAGE'});
            const toast = wrapper.find(Toast);
            expect(toast.length).toBe(1);
            expect(toast.prop('messageType')).toBe('WARNING');
            expect(toast.prop('message')).toBe('WARNING_MESSAGE');
        });

        it('shows an error toast when both an error and warning are present', () => {
            const { wrapper } = setup({error: 'ERROR_MESSAGE', warning: 'WARNING_MESSAGE'});
            const toast = wrapper.find(Toast);
            expect(toast.length).toBe(1);
            expect(toast.prop('messageType')).toBe('ERROR');
            expect(toast.prop('message')).toBe('ERROR_MESSAGE');
        });

        it('shows no toast if neither an error nor warning are present', () => {
            const { wrapper } = setup();
            const toast = wrapper.find(Toast);
            expect(toast.length).toBe(0);
        });

    });

    describe('onSubmit', () => {

        it('is called when the form is submitted', () => {
            const onSubmitSpy = expect.createSpy();
            const { wrapper } = setup({onSubmit: onSubmitSpy});
            wrapper.find('form').simulate('submit');
            expect(onSubmitSpy.calls.length).toEqual(1, 'Should have called the onSubmit prop');
        });

    });

});

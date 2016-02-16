import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { CreateTeamForm } from '../../../src/common/components/CreateTeamForm';
import FormDialog from '../../../src/common/components/FormDialog';
import { createTeam, hideCreateTeamModal } from '../../../src/common/actions/teams';

function setup(overrides) {
    const defaults = {
        dispatch: expect.createSpy(),
        fields: {
            description: {onChange: expect.createSpy(), value: ''},
            name: {onChange: expect.createSpy(), value: ''},
            people: {onChange: expect.createSpy(), value: []},
        },
        formSubmitting: false,
        handleSubmit: () => expect.createSpy(),
        resetForm: expect.createSpy(),
        visible: false,
    };
    const props = Object.assign({}, defaults, overrides);
    const context = {history: {pushState: expect.createSpy()}};

    const wrapper = shallow(<CreateTeamForm {...props} />, {context: context});

    return {
        props,
        wrapper,
    };
}

describe('CreateTeamForm', () => {

    describe('visibility', () => {

        it('resets the form when the it becomes visible', () => {
            const resetFormSpy = expect.createSpy();
            const { wrapper } = setup({resetForm: resetFormSpy});
            wrapper.setProps({visible: true});
            expect(resetFormSpy).toHaveBeenCalled('Should reset the form');
        });

    });

    describe('canceling', () => {

        it('dispatches the hide modal action', () => {
            const dispatchSpy = expect.createSpy();
            const { wrapper } = setup({dispatch: dispatchSpy});
            wrapper.find(FormDialog).prop('onCancel')();
            expect(dispatchSpy).toHaveBeenCalledWith(hideCreateTeamModal());
        });

    });

    describe('submitting', () => {

        it('dispatches the create team action', () => {
            const dispatchSpy = expect.createSpy();
            const handleSubmit = (fn) => () => {
                fn({
                    name: 'NAME',
                    description: 'DESCRIPTION',
                }, dispatchSpy);
            };
            const { wrapper } = setup({handleSubmit: handleSubmit});
            wrapper.find(FormDialog).prop('onSubmit')();
            const action = createTeam('NAME', 'DESCRIPTION');
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });

    });

});

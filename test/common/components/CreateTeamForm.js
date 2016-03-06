import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { CreateTeamForm } from '../../../src/common/components/CreateTeamForm';
import FormDialog from '../../../src/common/components/FormDialog';
import { createTeam } from '../../../src/common/actions/teams';
import { hideFormDialog } from '../../../src/common/actions/forms';
import { CREATE_TEAM } from '../../../src/common/constants/forms';
import { getDefaultContext } from '../../componentWithContext';


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
    const context = getDefaultContext({history: {pushState: expect.createSpy()}});

    const wrapper = shallow(<CreateTeamForm {...props} />, { context });

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
            expect(dispatchSpy).toHaveBeenCalledWith(hideFormDialog(CREATE_TEAM));
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

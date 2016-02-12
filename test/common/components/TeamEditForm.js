import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import FormDialog from '../../../src/common/components/FormDialog';
import { getTeam } from '../../factories/TeamFactory';
import { TeamEditForm } from '../../../src/common/components/TeamEditForm';
import { updateTeam, hideTeamEditModal } from '../../../src/common/actions/teams';

function setup(overrides) {
    const defaults = {
        dispatch: expect.createSpy(),
        fields: {
            contacts: [],
            description: {onChange: expect.createSpy(), value: ''},
            name: {onChange: expect.createSpy(), value: ''},
        },
        formSubmitting: false,
        handleSubmit: () => expect.createSpy(),
        resetForm: expect.createSpy(),
        team: getTeam(),
        visible: false,
    };
    const props = Object.assign({}, defaults, overrides);
    const context = {history: {pushState: expect.createSpy()}};

    const wrapper = shallow(<TeamEditForm {...props} />, {context: context});

    return {
        props,
        wrapper,
    };
}

describe('TeamEditForm', () => {

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
            expect(dispatchSpy).toHaveBeenCalledWith(hideTeamEditModal());
        });

    });

    describe('submitting', () => {

        it('dispatches the update team action', () => {
            const dispatchSpy = expect.createSpy();
            const handleSubmit = (fn) => () => {
                fn({
                    contacts: [],
                    name: 'NAME',
                    description: 'DESCRIPTION',
                }, dispatchSpy);
            };
            const { props: {team}, wrapper } = setup({handleSubmit: handleSubmit});
            wrapper.find(FormDialog).prop('onSubmit')();
            const action = updateTeam(team);
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });

    });

});

import Immutable from 'immutable';
import { actionTypes as formActionTypes } from 'redux-form';

import * as actionTypes from '../constants/actionTypes';
import * as formTypes from '../constants/forms';

const FORMS = [
    {
        type: formTypes.ASK_QUESTION,
        save: actionTypes.ASK_QUESTION,
        saveSuccess: actionTypes.ASK_QUESTION_SUCCESS,
        saveFailure: actionTypes.ASK_QUESTION_FAILURE,
    },
    {
        type: formTypes.EDIT_PROFILE,
        save: actionTypes.UPDATE_PROFILE,
        saveSuccess: actionTypes.UPDATE_PROFILE_SUCCESS,
        saveFailure: actionTypes.UPDATE_PROFILE_FAILURE,
    },
];

function buildInitialState(forms) {
    const state = {};
    forms.forEach(form => {
        state[form.type] = {
            submitting: false,
            visible: false,
        }
    });
    return state;
}
const initialState = Immutable.fromJS(buildInitialState(FORMS));

function buildActionLookup(forms, saveType) {
    const object = {};
    forms.forEach(form => {
        object[form[saveType]] = form.type;
    });
    return object;
}

// Build lookup objects rather than iterating through all forms, since lookup
// happens for every single redux action that is dispatched.
const saveLookup = buildActionLookup(FORMS, 'save');
const saveSuccessLookup = buildActionLookup(FORMS, 'saveSuccess');
const saveFailureLookup = buildActionLookup(FORMS, 'saveFailure');

function handleSaveActions(state, action) {
    const save = saveLookup[action.type];
    const saveSuccess = saveSuccessLookup[action.type];
    const saveFailure = saveFailureLookup[action.type];
    const form = save || saveSuccess || saveFailure;

    if (save) {
        return state.mergeIn([form], {submitting: true});
    } else if (saveSuccess) {
        return state.mergeIn([form], {
            submitting: false,
            visible: false,
        });
    } else if (saveFailure) {
        return state.mergeIn([form], {submitting: false});
    } else {
        return state;
    }
}

export default function (state = initialState, action) {
    switch(action.type) {
    case formActionTypes.RESET:
        return state.mergeIn([action.form], {submitting: false});
    case actionTypes.SHOW_FORM_DIALOG:
        return state.mergeIn([action.form], {visible: true});
    case actionTypes.HIDE_FORM_DIALOG:
        return state.mergeIn([action.form], {visible: false});
    }

    return handleSaveActions(state, action);
};

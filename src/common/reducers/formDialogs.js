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
    {
        type: formTypes.ADD_MEMBERS,
        save: actionTypes.ADD_MEMBERS,
        saveFailure: actionTypes.ADD_MEMBERS_FAILURE,
        saveSuccess: actionTypes.ADD_MEMBERS_SUCCESS,
    },
    {
        type: formTypes.CREATE_COLLECTION,
        save: actionTypes.CREATE_COLLECTION,
        saveFailure: actionTypes.CREATE_COLLECTION_FAILURE,
        saveSuccess: actionTypes.CREATE_COLLECTION_SUCCESS,
    },
    {
        type: formTypes.EDIT_COLLECTION,
        save: actionTypes.UPDATE_COLLECTION,
        saveFailure: actionTypes.UPDATE_COLLECTION_FAILURE,
        saveSuccess: actionTypes.UPDATE_COLLECTION_SUCCESS,
    },
    {
        type: formTypes.EDIT_TEAM,
        save: actionTypes.UPDATE_TEAM,
        saveFailure: actionTypes.UPDATE_TEAM_FAILURE,
        saveSuccess: actionTypes.UPDATE_TEAM_SUCCESS,
    },
    {
        type: formTypes.REQUEST_MISSING_INFO,
        save: actionTypes.REQUEST_MISSING_INFO,
        saveFailure: actionTypes.REQUEST_MISSING_INFO_FAILURE,
        saveSuccess: actionTypes.REQUEST_MISSING_INFO_SUCCESS,
    },
    {
        type: formTypes.CREATE_TEAM,
        save: types.CREATE_TEAM,
        saveFailure: types.CREATE_TEAM_FAILURE,
        saveSuccess: types.CREATE_TEAM_SUCCESS,
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
            payload: action.payload,
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

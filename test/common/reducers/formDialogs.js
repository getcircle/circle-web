import expect from 'expect';
import { reset } from 'redux-form';
import Immutable from 'immutable';

import {
    ASK_QUESTION as SAVE,
    ASK_QUESTION_SUCCESS as SAVE_SUCCESS,
    ASK_QUESTION_FAILURE as SAVE_FAILURE,
} from '../../../src/common/constants/actionTypes';
import { ASK_QUESTION as FORM } from '../../../src/common/constants/forms';
import formDialogs from '../../../src/common/reducers/formDialogs';
import { hideFormDialog, showFormDialog } from '../../../src/common/actions/formDialogs';

function getState(attributes) {
    const state = {};
    state[FORM] = Object.assign({visible: false, submitting: false}, attributes);
    return Immutable.fromJS(state);
}

function itIsShown(state) {
    it('is shown', () => expect(state.getIn([FORM, 'visible'])).toBe(true));
}

function itIsHidden(state) {
    it('is hidden', () => expect(state.getIn([FORM, 'visible'])).toBe(false));
}

function itIsSubmitting(state) {
    it('is submitting', () => expect(state.getIn([FORM, 'submitting'])).toBe(true));
}

function itIsNotSubmitting(state) {
    it('is not submitting', () => expect(state.getIn([FORM, 'submitting'])).toBe(false));
}

describe('formDialogs reducer', () => {

    describe('initially', () => {
        const state = formDialogs(undefined, {});
        itIsHidden(state);
        itIsNotSubmitting(state);
    });

    describe('showing', () => {
        const state = formDialogs(undefined, showFormDialog(FORM));
        itIsShown(state);
    });

    describe('hiding', () => {
        const previous = getState({visible: true});
        const state = formDialogs(previous, hideFormDialog(FORM));
        itIsHidden(state);
    });

    describe('resetting', () => {
        const previous = getState({submitting: true});
        const state = formDialogs(previous, reset(FORM));
        itIsNotSubmitting(state);
    });

    describe('saving', () => {
        const state = formDialogs(undefined, {type: SAVE});
        itIsSubmitting(state);
    });

    describe('saving succeeded', () => {
        const previous = getState({submitting: true, visible: true});
        const state = formDialogs(previous, {type: SAVE_SUCCESS});
        itIsNotSubmitting(state);
        itIsHidden(state);
    });

    describe('saving failed', () => {
        const previous = getState({submitting: true, visible: true});
        const state = formDialogs(previous, {type: SAVE_FAILURE});
        itIsNotSubmitting(state);
        itIsShown(state);
    });

});

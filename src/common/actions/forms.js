import * as types from '../constants/actionTypes';

/**
 * Show a dialog
 *
 * @param {String} form the form type
 * @return {Object} redux action
 */
export function showFormDialog(form) {
    return {type: types.SHOW_FORM_DIALOG, form: form};
}

/**
 * Hide a dialog
 *
 * @param {String} form the form type
 * @return {Object} redux action
 */
export function hideFormDialog(form) {
    return {type: types.HIDE_FORM_DIALOG, form: form};
}

import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.EDIT_TEAM,
    save: types.UPDATE_TEAM,
    saveFailure: types.UPDATE_TEAM_FAILURE,
    saveSuccess: types.UPDATE_TEAM_SUCCESS,
    showModal: types.MODAL_TEAM_EDIT_SHOW,
    hideModal: types.MODAL_TEAM_EDIT_HIDE,
});

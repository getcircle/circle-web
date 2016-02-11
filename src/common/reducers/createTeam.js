import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.CREATE_TEAM,
    save: types.CREATE_TEAM,
    saveFailure: types.CREATE_TEAM_FAILURE,
    saveSuccess: types.CREATE_TEAM_SUCCESS,
    showModal: types.MODAL_CREATE_TEAM_SHOW,
    hideModal: types.MODAL_CREATE_TEAM_HIDE,
});

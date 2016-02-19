import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.ADD_MEMBERS,
    save: types.ADD_MEMBERS,
    saveFailure: types.ADD_MEMBERS_FAILURE,
    saveSuccess: types.ADD_MEMBERS_SUCCESS,
    showModal: types.MODAL_ADD_MEMBERS_SHOW,
    hideModal: types.MODAL_ADD_MEMBERS_HIDE,
});

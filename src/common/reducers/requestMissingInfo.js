import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.REQUEST_MISSING_INFO,
    save: types.REQUEST_MISSING_INFO,
    saveFailure: types.REQUEST_MISSING_INFO_FAILURE,
    saveSuccess: types.REQUEST_MISSING_INFO_SUCCESS,
    showModal: types.MODAL_REQUEST_MISSING_INFO_SHOW,
    hideModal: types.MODAL_REQUEST_MISSING_INFO_HIDE,
});

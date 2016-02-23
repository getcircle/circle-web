import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.EDIT_COLLECTION,
    save: types.UPDATE_COLLECTION,
    saveFailure: types.UPDATE_COLLECTION_FAILURE,
    saveSuccess: types.UPDATE_COLLECTION_SUCCESS,
    showModal: types.MODAL_EDIT_COLLECTION_SHOW,
    hideModal: types.MODAL_EDIT_COLLECTION_HIDE,
});

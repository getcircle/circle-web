import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.CREATE_COLLECTION,
    save: types.CREATE_COLLECTION,
    saveFailure: types.CREATE_COLLECTION_FAILURE,
    saveSuccess: types.CREATE_COLLECTION_SUCCESS,
    showModal: types.SHOW_CREATE_COLLECTION_MODAL,
    hideModal: types.HIDE_CREATE_COLLECTION_MODAL,
});

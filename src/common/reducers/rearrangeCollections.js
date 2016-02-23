import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

import form from './form';

export default form({
    form: forms.REARRANGE_COLLECTIONS,
    save: types.REARRANGE_COLLECTIONS,
    saveFailure: types.REARRANGE_COLLECTIONS_FAILURE,
    saveSuccess: types.REARRANGE_COLLECTIONS_SUCCESS,
    showModal: types.MODAL_REARRANGE_COLLECTIONS_SHOW,
    hideModal: types.MODAL_REARRANGE_COLLECTIONS_HIDE,
});

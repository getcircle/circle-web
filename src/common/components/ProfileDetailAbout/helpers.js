import { EDIT_PROFILE } from '../../constants/forms';
import { showFormDialog } from '../../actions/forms';

export function buildShowModal(dispatch) {
    return () => dispatch(showFormDialog(EDIT_PROFILE));
};

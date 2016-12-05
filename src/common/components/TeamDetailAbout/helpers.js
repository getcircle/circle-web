import { showFormDialog } from '../../actions/forms';
import { EDIT_TEAM } from '../../constants/forms';

export function buildShowTeamEditModal(dispatch) {
    return () => dispatch(showFormDialog(EDIT_TEAM));
};

import { showTeamEditModal } from '../../actions/teams';

export function buildShowTeamEditModal(dispatch) {
    return () => dispatch(showTeamEditModal());
};

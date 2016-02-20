import { showModal } from '../../actions/profiles';

export function buildShowModal(dispatch) {
    return () => dispatch(showModal());
};

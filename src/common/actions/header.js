import * as types from '../constants/actionTypes';

export function toggleHeader(display) {
    return {
        type: types.TOGGLE_DISPLAY_HEADER,
        payload: display,
    }
}

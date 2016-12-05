import * as types from '../constants/actionTypes';

export function titleChanged(value, derived = false) {
    return {type: types.EDITOR_TITLE_CHANGED, payload: { derived, value }};
}

export function contentChanged(value) {
    return {type: types.EDITOR_CONTENT_CHANGED, payload: value};
}

export function reset() {
    return {type: types.EDITOR_RESET};
}

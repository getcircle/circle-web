import * as types from '../constants/actionTypes';

export function locationChanged() {
    return {
        type: types.LOCATION_CHANGED,
        payload: {
        },
    }
}

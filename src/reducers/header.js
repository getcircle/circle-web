import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    display: true,
});

export default function header(state = initialState, action) {
    switch(action.type) {
    case types.TOGGLE_DISPLAY_HEADER:
        return state.set('display', action.payload);
    default:
        return state;
    }
} 

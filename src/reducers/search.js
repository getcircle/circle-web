import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    results: [],
    active: false,
});

export default function search(state = initialState, action) {
    return state;
}
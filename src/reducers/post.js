import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    post: '',
    loading: false,
});

export default function post(state = initialState, action) {
    switch(action.type) {
    case types.CREATE_POST:
        return state.merge({
            post: '',
            loading: true,
        });

    case types.CREATE_POST_SUCCESS:
        console.log(action.payload);
        return state.merge({
            post: action.payload.post,
            loading: false,
        });

    case types.CREATE_POST_FAILURE:
        return state.merge({
            post: '',
            loading: false,
        });
    }

    return state;
}

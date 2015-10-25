import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    draftPost: '',
    loading: false,
});

export default function posts(state = initialState, action) {
    switch(action.type) {
    case types.CREATE_POST:
        return state.merge({
            draftPost: '',
            loading: true,
        });

    case types.CREATE_POST_SUCCESS:
        console.log('Sucess');
        console.log(action.payload);
        return state.merge({
            draftPost: action.payload.post,
            loading: false,
        });

    case types.CREATE_POST_FAILURE:
        return state.merge({
            draftPost: '',
            loading: false,
        });
    }

    return state;
}

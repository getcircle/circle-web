import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    ids: Immutable.Set(),
    loading: false,
    draftPost: null,
});

export default function post(state = initialState, action) {
    switch(action.type) {
    case types.CREATE_POST:
        return state.merge({
            loading: true,
        });

    case types.CREATE_POST_SUCCESS:
        return state.merge({
            draftPost: action.payload.post,
            loading: false,
        });

    case types.CREATE_POST_FAILURE:
        return state.merge({
            loading: false,
        });

    case types.GET_POST_SUCCESS:
        return state.updateIn(['ids'], set => set.add(action.payload.result));

    case '@@reduxReactRouter/locationDidChange':
        return state.merge({
            draftPost: null,
            loading: false,
        });

    case types.LOGOUT_SUCCESS:
        return initialState;
    }

    return state;
}

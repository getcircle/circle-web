import Immutable from 'immutable';
import { UPDATE_PATH } from 'redux-simple-router'

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    ids: Immutable.Set(),
    loading: false,
    draftPost: null,
    errors: [],
    errorDetails: [],
});

export default function post(state = initialState, action) {
    switch(action.type) {
    case types.UPDATE_POST:
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

    case types.GET_POST:
        return state.merge({
            loading: true,
            errors: [],
            errorDetails: [],
        });

    case types.UPDATE_POST_SUCCESS:
    case types.GET_POST_SUCCESS:
        console.log('GET_POST_SUCCESS: %s', state.get('ids'));
        console.log('GET_POST_SUCCESS payload: %s', action.payload.result);
        const newState = state.updateIn(['ids'], set => set.add(action.payload.result))
                    .merge({
                        loading: false,
                        errors: [],
                        errorDetails: [],
                    });
        console.log('GET_POST_SUCCESS POST: %s', newState.get('ids'));
        return newState;

    case types.GET_POST_FAILURE:
        return state.merge({
            errors: action.payload.errors,
            errorDetails: action.payload.errorDetails,
        });

    case UPDATE_PATH:
        return state.merge({
            draftPost: null,
            loading: false,
        });

    case types.LOGOUT_SUCCESS:
        return initialState;
    }

    return state;
}

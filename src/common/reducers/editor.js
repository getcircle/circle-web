import Immutable from 'immutable';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    content: null,
    title: {},
    draft: null,
    saving: false,
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.EDITOR_TITLE_CHANGED:
        return state.set('title', Immutable.fromJS(action.payload));
    case types.EDITOR_CONTENT_CHANGED:
        return state.set('content', action.payload);
    case types.EDITOR_RESET:
        return initialState;
    case types.CREATE_POST:
    case types.UPDATE_POST:
        return state.set('saving', true);
    case types.UPDATE_POST_SUCCESS:
        return state.set('saving', false);
    case types.CREATE_POST_SUCCESS:
        return state.merge({
            'draft': action.payload.post,
            'saving': false,
        });
    case types.CREATE_POST_FAILURE:
        return state.set('saving', false);
    }
    return state;
};

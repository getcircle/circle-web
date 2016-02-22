import Immutable from 'immutable';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    content: null,
    title: {},
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.EDITOR_TITLE_CHANGED:
        return state.set('title', Immutable.fromJS(action.payload));
    case types.EDITOR_CONTENT_CHANGED:
        return state.set('content', action.payload);
    case types.EDITOR_RESET:
        return initialState;
    }
    return state;
};

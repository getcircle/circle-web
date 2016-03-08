import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    pendingTeamToDelete: null,
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.HIDE_CONFIRM_DELETE_TEAM_MODAL:
        return state.set('pendingTeamToDelete', null);
    case types.SHOW_CONFIRM_DELETE_TEAM_MODAL:
        return state.set('pendingTeamToDelete', action.payload);
    }
    return state;
}

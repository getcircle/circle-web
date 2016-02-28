import Immutable from 'immutable';

import {
    getTeamMemberNormalizationFromJoinTeam,
} from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({

});

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
    case types.GET_TEAM_SUCCESS:
        if (payload.member) {
            return state.setIn([payload.result, 'memberId'], payload.member.id);
        }
        break;
    case types.JOIN_TEAM_SUCCESS:
        const memberId = getTeamMemberNormalizationFromJoinTeam(action);
        return state.setIn([payload.result, 'memberId'], memberId);
    case types.LEAVE_TEAM_SUCCESS:
        return state.setIn([payload.teamId, 'memberId'], null);
    }
    return state;
}

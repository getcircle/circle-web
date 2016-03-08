import Immutable from 'immutable';
import { services } from 'protobufs';

import {
    getTeamMemberNormalizationFromJoinTeam,
    getTeamMemberNormalizationsFromCreateTeam,
    getTeamMemberForProfileNormalizations,
} from './normalizations';
import { retrieveTeamMembers } from './denormalizations';
import * as types from '../constants/actionTypes';

const { COORDINATOR } = services.team.containers.TeamMemberV1.RoleV1;

const initialState = Immutable.Map();

export default function (state = initialState, action) {
    const { type, payload } = action;
    let ids;
    switch(type) {
    case types.CREATE_TEAM_SUCCESS:
        let coordinator;
        ids = getTeamMemberNormalizationsFromCreateTeam(action);
        if (ids) {
            const members = retrieveTeamMembers(ids, action.payload);
            for (let member of members) {
                if (member.role === COORDINATOR) {
                    coordinator = member;
                    break;
                }
            }
        }
        if (coordinator) {
            return state.setIn([action.payload.result, 'memberId'], coordinator.id);
        }
    case types.GET_TEAM_SUCCESS:
        if (payload.member) {
            return state.setIn([payload.result, 'memberId'], payload.member.id);
        }
        break;
    case types.JOIN_TEAM_SUCCESS:
        const memberId = getTeamMemberNormalizationFromJoinTeam(action);
        return state.setIn([payload.result, 'memberId'], memberId);
    case types.REMOVE_MEMBERS_SUCCESS:
        const { payload: { teamId, members } } = action;
        return state.withMutations(map => {
            for (let member of members) {
                if (map.getIn([teamId, 'memberId']) === member.id) {
                    map.setIn([teamId, 'memberId'], null);
                }
            }
            return map;
        });
    case types.LEAVE_TEAM_SUCCESS:
        return state.setIn([payload.teamId, 'memberId'], null);
    case types.GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS:
        ids = getTeamMemberForProfileNormalizations(action);
        if (ids) {
            const members = retrieveTeamMembers(ids, action.payload);
            return state.withMutations(map => {
                for (let member of members) {
                    map.setIn([member.team_id, 'memberId'], member.id);
                }
                return map;
            });
        }
    }
    return state;
}

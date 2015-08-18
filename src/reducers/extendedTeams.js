import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    loading: false,
    objects: {},
});

export default function extendedTeams(state=initialState, action) {
    switch(action.type) {
    case types.LOAD_EXTENDED_TEAM:
        return state.set('loading', true);
    case types.LOAD_EXTENDED_TEAM_SUCCESS:
        return state.withMutations(map => {
            map.updateIn(['objects'], map => {
                return map.set(
                    action.payload.team.id,
                    action.payload,
                )
            })
                .set('loading', false);
        });
    case types.LOAD_EXTENDED_TEAM_FAILURE:
        return state.set('loading', false);
    default:
        return state;
    }
}

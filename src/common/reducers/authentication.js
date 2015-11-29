import Immutable from 'immutable';

import { retrieveProfile } from '../reducers/denormalizations';
import * as types from '../constants/actionTypes';

function getInitialState() {
    return Immutable.fromJS({
        user: null,
        profile: null,
        organization: null,
        authError: null,
        authenticated: false,
        email: null,
        organizationDomain: null,
        providerName: null,
        organizationImageUrl: null,
        team: null,
        managesTeam: null,
        profileLocation: null,
        flags: null,
    });
}

function handleAuthenticateSuccess(state, action) {
    const {
        user,
        profile,
        team,
        managesTeam,
        profileLocation,
        organization,
        flags,
    } = action.payload;
    const nextState = state.merge({
        user,
        profile,
        team,
        managesTeam,
        profileLocation,
        organization,
        flags,
        authenticated: true,
    });
    return nextState;
}

function handleRefreshSuccess(state, action) {
    const {
        profile,
        team,
        managesTeam,
        profileLocation,
        organization,
        flags,
    } = action.payload;
    const nextState = state.merge({
        profile,
        team,
        managesTeam,
        profileLocation,
        organization,
        flags,
    });
    return nextState;
}

function handleGetAuthenticationInstructionsSuccess(state, action) {
    return state.merge({...action.payload});
}

function handleAuthenticationFailure(state, action) {
    return state.merge({authError: action.payload});
}

export function getAuthenticatedProfile(state, cache) {
    let profile = state.get('profile');
    if (profile) {
        let cachedProfile = retrieveProfile(profile.id, cache)
        if (cachedProfile) {
            profile = cachedProfile;
        }
    }
    return profile;
}

const initialState = getInitialState();

export default function authentication(state = initialState, action) {
    if (action.error && action.payload.status) {
        // XXX handle FORBIDDEN response
        if ([401, 403].indexOf(action.payload.status) !== -1) {
            return getInitialState();
        }
    }

    switch (action.type) {
    case types.AUTHENTICATE_SUCCESS:
        return handleAuthenticateSuccess(state, action);
    case types.AUTHENTICATE_FAILURE:
    case types.GET_AUTHENTICATION_INSTRUCTIONS_FAILURE:
        return handleAuthenticationFailure(state, action);
    case types.GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS:
        return handleGetAuthenticationInstructionsSuccess(state, action);
    case types.LOGOUT_SUCCESS:
        return getInitialState();
    case types.REFRESH_SUCCESS:
        return handleRefreshSuccess(state, action);
    default:
        return state;
    }
}

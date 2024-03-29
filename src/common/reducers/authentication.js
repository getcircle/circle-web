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
        flags: null,
        loaded: false,
    });
}

function handleAuthenticateSuccess(state, action) {
    const {
        user,
        profile,
        organization,
        flags,
    } = action.payload;
    const nextState = state.merge({
        user,
        profile,
        organization,
        flags,
        authenticated: true,
    });
    return nextState;
}

function handleLoadAuthSuccess(state, action) {
    const {
        profile,
        organization,
        flags,
    } = action.payload;
    const nextState = state.merge({
        profile,
        organization,
        flags,
        loaded: true,
        authenticated: true,
    });
    return nextState;
}

function handleLoadAuthFailure(state, action) {
    return state.merge({loaded: true});
}

function handleGetAuthenticationInstructionsSuccess(state, action) {
    return state.merge({...action.payload});
}

function handleAuthenticationFailure(state, action) {
    return state.merge({authError: true});
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

export function isLoaded(globalState) {
    return globalState.get('authentication') && globalState.get('authentication').get('loaded');
}

export function isAuthenticated(globalState) {
    return globalState.get('authentication') && globalState.get('authentication').get('authenticated');
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
    case types.GET_INTEGRATION_AUTHENTICATION_INSTRUCTIONS_SUCCESS:
        return handleGetAuthenticationInstructionsSuccess(state, action);
    case types.LOGOUT_SUCCESS:
        return getInitialState();
    case types.LOAD_AUTH_SUCCESS:
        return handleLoadAuthSuccess(state, action);
    case types.LOAD_AUTH_FAILURE:
        return handleLoadAuthFailure(state, action);
    default:
        return state;
    }
}

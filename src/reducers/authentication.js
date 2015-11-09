import Immutable from 'immutable';
import { services } from 'protobufs';

import client from '../services/client';
import { AUTHENTICATION_STATE } from '../constants/localStorageKeys';
import logger from '../utils/logger';
import tracker from '../utils/tracker';
import { retrieveProfile } from '../reducers/denormalizations';
import * as types from '../constants/actionTypes';

const { LocationV1, OrganizationV1, TeamV1 } = services.organization.containers;
const { ProfileV1 } = services.profile.containers;
const { UserV1 } = services.user.containers;

const STATE_VERSION = 1;
const PROTOBUF_KEYS = ['user', 'profile', 'organization', 'team', 'managesTeam', 'profileLocation'];

function getLocalAuthenticationState() {
    try {
        const serializedState = localStorage.getItem(AUTHENTICATION_STATE);
        let previousState = JSON.parse(serializedState);
        for (let key of PROTOBUF_KEYS) {
            let ProtobufClass;
            switch (key) {
            case 'user':
                ProtobufClass = UserV1;
                break;
            case 'profile':
                ProtobufClass = ProfileV1;
                break;
            case 'organization':
                ProtobufClass = OrganizationV1;
                break;
            case 'team':
                ProtobufClass = TeamV1;
                break;
            case 'managesTeam':
                ProtobufClass = TeamV1;
                break;
            case 'profileLocation':
                ProtobufClass = LocationV1;
                break;
            default:
                // Conservatively clear state and return blank initial state
                clearState();
                return initialState;
            }

            if (previousState[key]) {
                previousState[key] = ProtobufClass.decode64(previousState[key]);
            }
        }

        let initialState;
        if (previousState.__version__ === STATE_VERSION) {
            initialState = Immutable.fromJS(previousState);
            client.authenticate(initialState.get('token'));
        }
        return initialState;
    } catch (e) {
        logger.error('Error retrieving local authentication state', e);
        return;
    }
}

const getInitialState = (checkCache = true) => {
    /*
        Check for any existing reserved keys like `location` being used by Redux libraries
        Those are not namespaced and can cause weird application errors.
    */
    let initialState = Immutable.fromJS({
        __version__: STATE_VERSION,
        user: null,
        token: null,
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

    let localState;
    if (checkCache) {
        localState = getLocalAuthenticationState();
    }
    if (localState) {
        return localState;
    }
    return initialState;
}

function storeState(state) {
    let nextState = state.toJS();
    for (let key of PROTOBUF_KEYS) {
        if (nextState[key]) {
            nextState[key] = nextState[key].encode64();
        }
    }
    localStorage.setItem(AUTHENTICATION_STATE, JSON.stringify(nextState));
}

function clearState() {
    localStorage.clear();
    client.logout();
    tracker.clearSession();
    let state = getInitialState(false);
    return state;
}

function handleAuthenticateSuccess(state, action) {
    const {user, token, profile, team, managesTeam, profileLocation, organization} = action.payload;
    const nextState = state.merge({user, token, profile, team, managesTeam, profileLocation, organization, authenticated: true});
    storeState(nextState);
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
    storeState(nextState);
    return nextState;
}

function handleGetAuthenticationInstructionsSuccess(state, action) {
    return state.merge({...action.payload});
}

function handleAuthenticationFailure(state, action) {
    return state.merge({authError: action.payload});
}

const initialState = getInitialState();

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

export default function authentication(state = initialState, action) {
    if (action.error && action.payload.status) {
        if ([401, 403].indexOf(action.payload.status) !== -1) {
            return clearState();
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
        return clearState();
    case types.REFRESH_SUCCESS:
        return handleRefreshSuccess(state, action);
    default:
        return state;
    }
}

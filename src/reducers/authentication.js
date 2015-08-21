import Immutable from 'immutable';
import { services } from 'protobufs';

import client from '../services/client';
import { AUTHENTICATION_STATE } from '../constants/localStorageKeys';
import * as types from '../constants/actionTypes';

const { OrganizationV1 } = services.organization.containers;
const { ProfileV1 } = services.profile.containers;
const { UserV1 } = services.user.containers;

const stateVersion = 1;
const protobufKeys = ['user', 'profile', 'organization'];

const getInitialState = (checkCache = true) => {
    let initialState = Immutable.fromJS({
        __version__: stateVersion,
        user: null,
        token: null,
        profile: null,
        organization: null,
        authError: null,
        authenticated: false,
    });

    let serializedState;
    if (checkCache) {
        serializedState = localStorage.getItem(AUTHENTICATION_STATE);
    }
    if (serializedState) {
        // XXX catch this error
        let previousState = JSON.parse(serializedState);
        for (let key of protobufKeys) {
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
            default:
                // Conservatively clear state and return blank initial state
                clearState();
                return initialState;
            }
            previousState[key] = ProtobufClass.decode64(previousState[key]);
        }
        if (previousState.__version__ === stateVersion) {
            initialState = Immutable.fromJS(previousState);
            client.authenticate(initialState.get('token'));
        }
    }
    return initialState;
}

// XXX clearState on LOGOUT
const storeState = (state) => {
    let nextState = state.toJS();
    for (let key of protobufKeys) {
        nextState[key] = nextState[key].encode64();
    }
    localStorage.setItem(AUTHENTICATION_STATE, JSON.stringify(nextState));
}

const clearState = () => {
    localStorage.clear();
    client.logout();
    let state = getInitialState(false);
    return state;
}

const handleAuthenticateSuccess = (state, action) => {
    const {user, token, profile, organization} = action.payload;
    const nextState = state.merge({user, token, profile, organization, authenticated: true});
    storeState(nextState);
    return nextState;
}

const handleRefreshSuccess = (state, action) => {
    const {profile, organization} = action.payload;
    const nextState = state.merge({profile, organization});
    storeState(nextState);
    return nextState;
}

const initialState = getInitialState();

export default function authentication(state = initialState, action) {
    switch (action.type) {
    case types.AUTHENTICATE_SUCCESS:
        return handleAuthenticateSuccess(state, action);
    case types.LOGOUT_SUCCESS:
        return clearState();
    case types.REFRESH_SUCCESS:
        return handleRefreshSuccess(state, action);
    default:
        return state;
    }
}

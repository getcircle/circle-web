import Immutable from 'immutable';
import { services } from 'protobufs';

import { AUTHENTICATION_STATE } from '../constants/localStorageKeys';
import * as types from '../constants/actionTypes';

const { OrganizationV1 } = services.organization.containers;
const { ProfileV1 } = services.profile.containers;
const { UserV1 } = services.user.containers;

const stateVersion = 1;
const protobufKeys = ['user', 'profile', 'organization'];

const getInitialState = () => {
    let initialState = Immutable.fromJS({
        __version__: stateVersion,
        user: null,
        token: null,
        profile: null,
        organization: null,
        authError: null,
        authenticated: false,
    });

    debugger;
    const serializedState = localStorage.getItem(AUTHENTICATION_STATE);
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
                localStorage.clear();
                return initialState;
            }
            previousState[key] = ProtobufClass.decode64(previousState[key]);
        }
        if (previousState.__version__ === stateVersion) {
            initialState = Immutable.fromJS(previousState);
        }
    }
    return initialState;
}

// XXX clearState on LOGOUT
const storeState = (state) => {
    debugger;
    let nextState = state.toJS();
    for (let key of protobufKeys) {
        nextState[key] = nextState[key].encode64();
    }
    localStorage.setItem(AUTHENTICATION_STATE, JSON.stringify(nextState));
}

const initialState = getInitialState();

export default function authentication(state = initialState, action) {
    switch (action.type) {
    case types.AUTHENTICATE_SUCCESS:
        const {user, token, profile, organization} = action.payload;
        const nextState = state.merge({user, token, profile, organization, authenticated: true});
        storeState(nextState);
        return nextState;
    default:
        return state;
    }
}
import { createSelectorCreator } from 'reselect';
import Immutable from 'immutable';

const createImmutableSelector = createSelectorCreator(Immutable.is);

export const authenticationSelector = state => state.authentication;

export const authenticatedSelector = createImmutableSelector(
    [authenticationSelector],
    (authenticationState) => { return { authenticated: authenticationState.get("authenticated") } },
);

export const searchSelector = state => state.search;
export const profilesSelector = state => state.profiles;
export const extendedProfilesSelector = state => state.extendedProfiles;
export const routerSelector = state => state.router;
export const locationsSelector = state => state.locations;
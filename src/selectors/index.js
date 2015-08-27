import { createSelectorCreator } from 'reselect';
import Immutable from 'immutable';

import { EXPLORE_TYPES } from '../actions/explore';

export const createImmutableSelector = createSelectorCreator(Immutable.is);

export const authenticationSelector = state => state.authentication;

export const authenticatedSelector = createImmutableSelector(
    [authenticationSelector],
    (authenticationState) => { return { authenticated: authenticationState.get('authenticated') } },
);

export const cacheSelector = state => state.cache;
export const exploreSelector = state => state.explore;

export const exploreSelectorFactory = exploreType => {
    return createImmutableSelector(
        [exploreSelector],
        exploreState => exploreState.get(exploreType),
    );
}

export const exploreProfilesSelector = exploreSelectorFactory(EXPLORE_TYPES.PROFILES);
export const exploreProfilesLoadingSelector = createImmutableSelector(
    [exploreProfilesSelector],
    profilesState => profilesState ? profilesState.get('loading') : false,
);
export const exploreProfilesIdsSelector = createImmutableSelector(
    [exploreProfilesSelector],
    (profilesState) => {
        return Immutable.fromJS({
            ids: profilesState ? profilesState.get('ids') : Immutable.List(),
            nextRequest: profilesState ? profilesState.get('nextRequest') : null,
        });
    }
);

export const extendedProfilesSelector = state => state.extendedProfiles;
export const extendedTeamsSelector = state => state.extendedTeams;
export const headerSelector = state => state.header;
export const locationMembersSelector = state => state.locationMembers;
export const locationsSelector = state => state.locations;
export const profilesSelector = state => state.profiles;
export const routerSelector = state => state.router;
export const routerParametersSelector = state => state.router.params;
export const searchSelector = state => state.search;
export const teamMembersSelector = state => state.teamMembers;

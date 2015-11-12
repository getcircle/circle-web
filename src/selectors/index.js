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

export const exploreTypeLoadingSelectorFactory = exploreTypeSelector => {
    return createImmutableSelector(
        [exploreTypeSelector],
        exploreTypeState => exploreTypeState ? exploreTypeState.get('loading') : false,
    );
}

export const exploreTypeIdsSelectorFactory = exploreTypeSelector => {
    return createImmutableSelector(
        [exploreTypeSelector],
        (exploreTypeState) => {
            return Immutable.fromJS({
                ids: exploreTypeState ? exploreTypeState.get('ids') : Immutable.List(),
                nextRequest: exploreTypeState ? exploreTypeState.get('nextRequest') : null,
            });
        });
}

export const exploreProfilesSelector = exploreSelectorFactory(EXPLORE_TYPES.PROFILES);
export const exploreProfilesLoadingSelector = exploreTypeLoadingSelectorFactory(exploreProfilesSelector);
export const exploreProfilesIdsSelector = exploreTypeIdsSelectorFactory(exploreProfilesSelector);

export const exploreTeamsSelector = exploreSelectorFactory(EXPLORE_TYPES.TEAMS);
export const exploreTeamsLoadingSelector = exploreTypeLoadingSelectorFactory(exploreTeamsSelector);
export const exploreTeamsIdsSelector = exploreTypeIdsSelectorFactory(exploreTeamsSelector);

export const exploreLocationsSelector = exploreSelectorFactory(EXPLORE_TYPES.LOCATIONS);
export const exploreLocationsLoadingSelector = exploreTypeLoadingSelectorFactory(exploreLocationsSelector);
export const exploreLocationsIdsSelector = exploreTypeIdsSelectorFactory(exploreLocationsSelector);

export const extendedProfilesSelector = state => state.extendedProfiles;
export const extendedTeamsSelector = state => state.extendedTeams;
export const filesSelector = state => state.files;
export const locationMembersSelector = state => state.locationMembers;
export const locationsSelector = state => state.locations;
export const mediaUploadSelector = state => state.mediaUpload;
export const postSelector = state => state.post;
export const postsSelector = state => state.posts;
export const profilesSelector = state => state.profiles;
export const responsiveSelector = state => state.responsive;
export const routerSelector = state => state.router;
export const routerParametersSelector = state => state.router.params;
export const searchSelector = state => state.search;
export const statusesSelector = state => state.statuses;
export const teamMembersSelector = state => state.teamMembers;
export const updateProfileSelector = state => state.updateProfile;

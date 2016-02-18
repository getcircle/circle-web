import { createSelectorCreator, defaultMemoize } from 'reselect';
import Immutable from 'immutable';

import { EXPLORE_TYPES } from '../actions/explore';

export const createImmutableSelector = createSelectorCreator(defaultMemoize, Immutable.is);

export const authenticationSelector = state => state.get('authentication');

export const authenticatedSelector = createImmutableSelector(
    [authenticationSelector],
    (authenticationState) => { return { authenticated: authenticationState.get('authenticated') } },
);

export const autocompleteSelector = state => state.get('autocomplete');

export const cacheSelector = state => state.get('cache');
export const exploreSelector = state => state.get('explore');

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

export const explorePostsSelector = exploreSelectorFactory(EXPLORE_TYPES.POSTS);
export const explorePostsLoadingSelector = exploreTypeLoadingSelectorFactory(explorePostsSelector);
export const explorePostsIdsSelector = exploreTypeIdsSelectorFactory(explorePostsSelector);

export const createTeamSelector = state => state.get('createTeam');
export const extendedProfilesSelector = state => state.get('extendedProfiles');
export const extendedTeamsSelector = state => state.get('extendedTeams');
export const filesSelector = state => state.get('files');
export const locationMembersSelector = state => state.get('locationMembers');
export const locationsSelector = state => state.get('locations');
export const mediaUploadSelector = state => state.get('mediaUpload');
export const postSelector = state => state.get('post');
export const postsSelector = state => state.get('posts');
export const profilesSelector = state => state.get('profiles');
export const responsiveSelector = state => state.get('responsive');
export const routerParametersSelector = (_, props) => props.params;
export const searchSelector = state => state.get('search');
export const teamCoordinatorsSelector = state => state.get('teamCoordinators');
export const teamMembersSelector = state => state.get('teamMembers');
export const updateProfileSelector = state => state.get('updateProfile');
export const updateTeamSelector = state => state.get('updateTeam');
export const addMembersSelector = state => state.get('addMembers');
export const profileMembershipsSelector = state => state.get('profileMemberships');

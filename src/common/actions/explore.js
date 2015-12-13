import keymirror from 'keymirror';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';

import { getPosts } from '../services/posts';
import { getProfiles } from '../services/profile';
import {
    getLocations,
    getTeams,
} from '../services/organization';
import { PostStateURLString } from '../utils/post';

const exploreActionTypes = [
    types.EXPLORE,
    types.EXPLORE_SUCCESS,
    types.EXPLORE_FAILURE,
];

export const EXPLORE_TYPES = keymirror({
    POSTS: null,
    PROFILES: null,
    TEAMS: null,
    LOCATIONS: null,
});

function shouldBail(exploreState, nextRequest) {
    if (exploreState && nextRequest === null && exploreState.get('ids').size) {
        return true;
    }
}

export function exploreProfiles(nextRequest) {
    const { PROFILES } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => getProfiles(null, nextRequest, PROFILES),
            bailout: (state) => {
                const profilesState = state.get('explore').get(PROFILES);
                return shouldBail(profilesState, nextRequest);
            }
        },
        meta: {
            paginateBy: PROFILES,
        },
    }
}

export function exploreTeams(nextRequest) {
    const { TEAMS } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => getTeams(null, nextRequest, TEAMS),
            bailout: (state) => {
                const teamsState = state.get('explore').get(TEAMS);
                return shouldBail(teamsState, nextRequest);
            },
        },
        meta: {
            paginateBy: TEAMS,
        }
    }
}

export function exploreLocations(nextRequest) {
    const { LOCATIONS } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => getLocations(null, nextRequest, LOCATIONS),
            bailout: (state) => {
                const locationsState = state.get('explore').get(LOCATIONS);
                return shouldBail(locationsState, nextRequest);
            },
        },
        meta: {
            paginateBy: LOCATIONS,
        },
    }
}

export function explorePosts(nextRequest) {
    const { POSTS } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => getPosts(PostStateURLString.LISTED, null, nextRequest, POSTS),
            bailout: (state) => {
                const postsState = state.get('explore').get(POSTS);
                return shouldBail(postsState, nextRequest);
            },
        },
        meta: {
            paginateBy: POSTS,
        },
    }
}

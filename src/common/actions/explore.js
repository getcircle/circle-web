import keymirror from 'keymirror';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';

import { getPosts } from '../services/posts';
import { getProfiles } from '../services/profile';
import { getTeams } from '../services/organization';
import { PostStateURLString } from '../utils/post';
import {
    retrievePosts,
    retrieveProfiles,
    retrieveTeams
} from '../reducers/denormalizations';

const exploreActionTypes = [
    types.EXPLORE,
    types.EXPLORE_SUCCESS,
    types.EXPLORE_FAILURE,
];

export const EXPLORE_TYPES = keymirror({
    POSTS: null,
    PROFILES: null,
    TEAMS: null,
});

function shouldBail(state, nextRequest, type) {
    const exploreState = state.get('explore').get(type);
    const cacheState = state.get('cache').toJS();
    if (exploreState && nextRequest === null) {
        const ids = exploreState.get('ids').toJS();
        if (ids.length > 0) {
            switch(type) {
            case EXPLORE_TYPES.POSTS:
                return retrievePosts(ids, cacheState) !== null;
            case EXPLORE_TYPES.PROFILES:
                return retrieveProfiles(ids, cacheState) !== null;
            case EXPLORE_TYPES.TEAMS:
                return retrieveTeams(ids, cacheState) !== null;
            }
        }
    }
}

export function exploreProfiles(nextRequest) {
    const { PROFILES } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: (client) => getProfiles(client, null, nextRequest, PROFILES),
            bailout: (state) => {
                return shouldBail(state, nextRequest, PROFILES);
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
            remote: (client) => getTeams(client, null, nextRequest, TEAMS),
            bailout: (state) => {
                return shouldBail(state, nextRequest, TEAMS);
            },
        },
        meta: {
            paginateBy: TEAMS,
        }
    }
}

export function explorePosts(nextRequest) {
    const { POSTS } = EXPLORE_TYPES;
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: (client) => getPosts(client, PostStateURLString.LISTED, null, nextRequest, POSTS),
            bailout: (state) => {
                return shouldBail(state, nextRequest, POSTS);
            },
        },
        meta: {
            paginateBy: POSTS,
        },
    }
}

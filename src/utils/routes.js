import { services } from 'protobufs';

import logger from './logger';

const NEXT_PATHNAME_KEY = 'n:p';

export function routeToProfile(router, profile) {
    router.transitionTo(`/profile/${profile.id}`);
}

export function routeToTeam(router, team) {
    router.transitionTo(`/team/${team.id}`);
}

export function routeToLocation(router, location) {
    router.transitionTo(`/location/${location.id}`);
}

export function routeToEditPost(router, post) {
    router.transitionTo(`/edit-post/${post.id}`);
}

export function routeToNewPost(router) {
    router.transitionTo('/new-post');
}

export function routeToStatus(router, status) {
    router.transitionTo(`/status/${status.id}`);
}

export function routeToPosts(router, postState) {
    router.transitionTo(`/posts/${postState}`);
}

export function routeToPost(router, post) {
    router.transitionTo(`/post/${post.id}`);
}

export function routeToURL(url, nextPathname = null) {
    if (nextPathname !== null) {
        localStorage.setItem(NEXT_PATHNAME_KEY, nextPathname);
    }
    window.location = url;
}

export function getNextPathname() {
    const nextPathname = localStorage.getItem(NEXT_PATHNAME_KEY);
    localStorage.removeItem(NEXT_PATHNAME_KEY);
    return nextPathname;
}

// const DRAFTS = 'drafts';
// const LISTED = 'published';
// const UNLISTED = 'unlisted';

// function getPostStateString(postState) {
//     switch (Number(postState)) {
//         case services.post.containers.PostStateV1.DRAFT:
//             return DRAFTS;
//         case services.post.containers.PostStateV1.LISTED:
//             return LISTED;
//         case services.post.containers.PostStateV1.UNLISTED:
//             return UNLISTED;
//     }

//     logger.error('Post state mapping not defined ' + postState);
//     return null;
// }

// export function getPostStateFromString(postStateString) {
//     switch (postStateString) {
//         case DRAFTS:
//             return services.post.containers.PostStateV1.DRAFT.toString();
//         case LISTED:
//             return services.post.containers.PostStateV1.LISTED.toString();
//     }

//     logger.error('Unknown post state string ' + postStateString);
//     return null;
// }

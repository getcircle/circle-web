import { services } from 'protobufs';

import logger from './logger';

export const PostStateURLString = {
    DRAFT: 'drafts',
    LISTED: 'published',
    UNLISTED: 'unlisted',
}

export function getPostStateURLString(postState) {
    switch (Number(postState)) {
        case services.post.containers.PostStateV1.DRAFT:
            return PostStateURLString.DRAFT;
        case services.post.containers.PostStateV1.LISTED:
            return PostStateURLString.LISTED;
        case services.post.containers.PostStateV1.UNLISTED:
            return PostStateURLString.UNLISTED;
    }

    logger.error('Post state mapping not defined ' + postState);
    return null;
}

export function getPostStateFromURLString(postStateString) {
    switch (postStateString) {
        case PostStateURLString.DRAFT:
            return services.post.containers.PostStateV1.DRAFT;
        case PostStateURLString.LISTED:
            return services.post.containers.PostStateV1.LISTED;
    }

    logger.error('Unknown post state string ' + postStateString);
    return null;
}

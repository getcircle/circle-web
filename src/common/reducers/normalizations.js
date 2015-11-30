import { getNormalizations } from 'protobuf-normalizr';
import { services } from 'protobufs';

export function getLocationNormalizations(action) {
    return getNormalizations(
        'locations',
        action.meta.paginateBy,
        services.organization.actions.get_locations.ResponseV1,
        action.payload,
    );
}

export function getProfileNormalizations(action) {
    return getNormalizations(
        'profiles',
        action.meta.paginateBy,
        services.profile.actions.get_profiles.ResponseV1,
        action.payload
    );
}

export function getTeamNormalizations(action) {
    return getNormalizations(
        'teams',
        action.meta.paginateBy,
        services.organization.actions.get_teams.ResponseV1,
        action.payload
    );
}

export function getPostsNormalizations(action) {
    return getNormalizations(
        'posts',
        action.meta.paginateBy,
        services.post.actions.get_posts.ResponseV1,
        action.payload
    );
}

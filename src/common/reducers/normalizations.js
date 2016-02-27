import { getNormalizations } from 'protobuf-normalizr';
import { services } from 'protobufs';
import { retrieveTeamMembers } from './denormalizations';

import * as requests from '../services/team';

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
        services.team.actions.get_teams.ResponseV1,
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

export function getCollectionItemsNormalizations(action) {
    return getNormalizations(
        'items',
        action.meta.paginateBy,
        services.post.actions.get_collection_items.ResponseV1,
        action.payload,
    );
}

export function getCollectionsNormalizations(key, cache) {
    return getNormalizations(
        'collections',
        key,
        services.post.actions.get_collections.ResponseV1,
        cache,
    );
}

export function getCollectionsForOwnerNormalizations(action) {
    return getNormalizations(
        'collections',
        action.meta.paginateBy,
        services.post.actions.get_collections.ResponseV1,
        action.payload,
    );
}

/**
 * Return the team member ids that have been normalized in the payload.
 *
 * @param {Object} action redux action
 * @param {services.team.containers.TeamMemberV1.RoleV1} role membership role
 *      we're fetching normalizations for. Since we fetch both members and
 *      coordinators with `get_members`, we cache the results as `${teamId}:${role}`
 *
 */
export function getTeamMemberNormalizations(action, role = services.team.containers.TeamMemberV1.RoleV1.MEMBER) {
    const key = requests.getMembersCacheKey(action.meta.paginateBy, role);
    return getNormalizations(
        'members',
        key,
        services.team.actions.get_members.ResponseV1,
        action.payload,
    );
}

/**
 * Return the team member ids that have been normalized in the payload. We
 * don't use a cache key to segment on role when fetching for profiles.
 *
 * @param {Object} action redux action
 *
 */
export function getTeamMemberForProfileNormalizations(action) {
    return getNormalizations(
        'members',
        action.meta.paginateBy,
        services.team.actions.get_members.ResponseV1,
        action.payload,
    );
}

/**
 * Return the team member ids that have been normalized in the payload.
 *
 * Only returns coordinator team member ids.
 *
 * @param {Object} action redux action
 *
 */
export function getTeamCoordinatorNormalizations(action) {
    const role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
    return getTeamMemberNormalizations(action, role);
}

function getTeamMemberNormalizationsFromResponse(action, response, role = null) {
    const ids = getNormalizations(
        'members',
        action.payload.result,
        response,
        action.payload,
    );
    const members = retrieveTeamMembers(ids, action.payload);
    const memberIds = [];
    for (let member of members) {
        if (member.role === role) {
            memberIds.push(member.id);
        }
    }
    return memberIds;
}

export function getTeamMemberNormalizationsFromAddMembers(action, role = null) {
    return getTeamMemberNormalizationsFromResponse(
        action,
        services.team.actions.add_members.ResponseV1,
        role,
    );
}

export function getTeamCoordinatorNormalizationsFromAddMembers(action) {
    const role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
    return getTeamMemberNormalizationsFromAddMembers(action, role);
}

export function getTeamMemberNormalizationsFromUpdateMembers(action, role = null) {
    return getTeamMemberNormalizationsFromResponse(
        action,
        services.team.actions.update_members.ResponseV1,
        role,
    );
}

export function getTeamCoordinatorNormalizationsFromUpdateMembers(action) {
    const role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
    return getTeamMemberNormalizationsFromUpdateMembers(action, role);
}

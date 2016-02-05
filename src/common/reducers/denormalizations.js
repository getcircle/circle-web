import { denormalize } from 'protobuf-normalizr';
import combine from 'protobuf-normalizr/lib/combine';
import { createRequiredFieldsValidator } from 'protobuf-normalizr/lib/validators';
import { services } from 'protobufs';

import { getMembersCacheKey } from '../services/team';

import { isEntityStale } from './cache';

function createTTLValidator(cache) {
    return (denormalizedEntity, entityKey, key) => {
        if (isEntityStale(cache, entityKey, key)) {
            return false;
        }
        return true;
    }
}

function retrieve(key, builder, cache, requiredFields) {
    const validator = combine(
        createRequiredFieldsValidator(requiredFields),
        createTTLValidator(cache),
    );
    let entity = null;
    if (!isEntityStale(cache, builder.$type.fqn().toLowerCase(), key)) {
        entity = denormalize(key, builder, cache, validator);
    }
    return entity;
}

export function retrieveExtendedProfile(profileId, cache) {
    return retrieve(profileId, services.profile.actions.get_extended_profile.ResponseV1, cache);
}

export function retrieveExtendedTeam(teamId, cache) {
    const team = retrieve(teamId, services.organization.actions.get_team.ResponseV1, cache);
    const reportingDetails = retrieve(
        teamId,
        services.organization.actions.get_team_reporting_details.ResponseV1,
        cache
    );
    if (team && reportingDetails) {
        return {reportingDetails, team: team.team};
    } else {
        return null;
    }
}

export function retrieveLocation(locationId, cache) {
    return retrieve(locationId, services.organization.containers.LocationV1, cache);
}

export function retrieveLocations(locationIds, cache) {
    return retrieve(locationIds, services.organization.containers.LocationV1, cache);
}

export function retrieveProfiles(profileIds, cache) {
    return retrieve(profileIds, services.profile.containers.ProfileV1, cache);
}

export function retrieveProfile(profileId, cache) {
    return retrieve(profileId, services.profile.containers.ProfileV1, cache);
}

export function retrieveStatus(statusId, cache) {
    return retrieve(statusId, services.profile.containers.ProfileStatusV1, cache);
}

export function retrievePost(postId, cache, requiredFields) {
    return retrieve(postId, services.post.containers.PostV1, cache, requiredFields);
}

export function retrievePosts(postIds, cache) {
    return retrieve(postIds, services.post.containers.PostV1, cache);
}

export function retrieveTeams(teamIds, cache) {
    return retrieve(teamIds, services.organization.containers.TeamV1, cache);
}

export function retrieveTeam(teamId, cache) {
    return retrieve(teamId, services.team.containers.TeamV1, cache);
}

/**
 * Retrieve team members from the cache.
 *
 * @param {Array} ids team member ids
 * @param {Object} cache cache state
 *
 */
export function retrieveTeamMembers(ids, cache) {
    return retrieve(ids, services.team.containers.TeamMemberV1, cache);
}

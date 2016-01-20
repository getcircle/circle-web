import { denormalize } from 'protobuf-normalizr';
import { services } from 'protobufs';

import { isEntityStale } from './cache';

function entityHasValueForField(entity, field) {
    const parts = field.split('.');
    const part = parts[0];
    const remainder = parts.slice(1).join('.');
    const value = entity[part];
    if (value !== undefined && value !== null) {
        if (remainder) {
            return entityHasValueForField(value, remainder);
        }
        return true;
    }
    return false;
}

function retrieve(key, builder, cache, requiredFields) {
    let entity = null;
    if (!isEntityStale(cache, builder.$type.fqn().toLowerCase(), key)) {
        entity = denormalize(key, builder, cache, (denormalizedEntity, entityKey, key) => {
            if (isEntityStale(cache, entityKey, key)) {
                return false;
            } else if (requiredFields && requiredFields.length > 0) {
                for (let field of requiredFields) {
                    if (!entityHasValueForField(denormalizedEntity, field)) {
                        return false;
                    }
                }
            }
            return true
        });
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

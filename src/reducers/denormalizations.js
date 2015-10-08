import { denormalize } from 'protobuf-normalizr';
import { services } from 'protobufs';

export function retrieveLocation(locationId, cache) {
    return denormalize(locationId, services.organization.containers.LocationV1, cache);
}

export function retrieveLocations(locationIds, cache) {
    return denormalize(locationIds, services.organization.containers.LocationV1, cache);
}

export function retrieveExtendedProfile(profileId, cache) {
    return denormalize(profileId, services.profile.actions.get_extended_profile.ResponseV1, cache);
}

export function retrieveExtendedTeam(teamId, cache) {
    const team = denormalize(teamId, services.organization.actions.get_team.ResponseV1, cache);
    const reportingDetails = denormalize(
        teamId,
        services.organization.actions.get_team_reporting_details.ResponseV1,
        cache
    );
    return {reportingDetails, team: team.team};
}

export function retrieveProfiles(profileIds, cache) {
    return denormalize(profileIds, services.profile.containers.ProfileV1, cache);
}

export function retrieveTeams(teamIds, cache) {
    return denormalize(teamIds, services.organization.containers.TeamV1, cache);
}

export function retrieveProfile(profileId, cache) {
    return denormalize(profileId, services.profile.containers.ProfileV1, cache);
}

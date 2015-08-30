import { getNormalizations } from 'protobuf-normalizr';
import { services } from 'protobufs';

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

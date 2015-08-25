import { getNormalizations } from 'protobuf-normalizr';
import { services } from 'protobufs';

import * as types from '../constants/actionTypes';
import paginate from './paginate';

function getProfileNormalizations(action) {
    return getNormalizations(
        'profiles',
        action.meta.paginateBy,
        services.profile.actions.get_profiles.ResponseV1,
        action.payload
    );
}

const locationMembers = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.LOAD_LOCATION_MEMBERS,
        types.LOAD_LOCATION_MEMBERS_SUCCESS,
        types.LOAD_LOCATION_MEMBERS_FAILURE,
    ],
});
export default locationMembers;

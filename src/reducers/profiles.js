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

const profiles = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.LOAD_PROFILES,
        types.LOAD_PROFILES_SUCCESS,
        types.LOAD_PROFILES_FAILURE,
    ],
});
export default profiles;

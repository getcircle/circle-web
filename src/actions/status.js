import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/status';

export function getStatus(parameters) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_STATUS,
                types.LOAD_STATUS_SUCCESS,
                types.LOAD_STATUS_FAILURE,
            ],
            remote: () => requests.getStatus(parameters),
        },
    };
}

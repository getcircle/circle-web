import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/payment';

export function storeToken(token) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.STORE_TOKEN,
                types.STORE_TOKEN_SUCCESS,
                types.STORE_TOKEN_FAILURE,
            ],
            remote: () => requests.storeToken(token),
        },
    };
}

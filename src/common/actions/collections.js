import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';
import { retrieveCollection } from '../reducers/denormalizations';

export function showCreateModal() {
    return {type: types.SHOW_CREATE_COLLECTION_MODAL};
}

export function hideCreateModal() {
    return {type: types.HIDE_CREATE_COLLECTION_MODAL};
}

export function showConfirmDeleteModal(collection) {
    return {type: types.SHOW_CONFIRM_DELETE_COLLECTION_MODAL, payload: collection};
}

export function hideConfirmDeleteModal() {
    return {type: types.HIDE_CONFIRM_DELETE_COLLECTION_MODAL};
}

export function createCollection({name, ownerType, ownerId}) {
    const collection = new services.post.containers.CollectionV1({
        name,
        /*eslint-disable camelcase*/
        owner_type: ownerType,
        owner_id: ownerId,
        /*eslint-enable camelcase*/
    });
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.CREATE_COLLECTION,
                types.CREATE_COLLECTION_SUCCESS,
                types.CREATE_COLLECTION_FAILURE,
            ],
            remote: client => requests.createCollection(client, collection),
        },
    };
}

export function getCollection(collectionId, requiredFields) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_COLLECTION,
                types.GET_COLLECTION_SUCCESS,
                types.GET_COLLECTION_FAILURE,
            ],
            remote: client => requests.getCollection(client, collectionId),
            bailout: (state) => {
                const collection = retrieveCollection(
                    collectionId,
                    state.get('cache').toJS(),
                    requiredFields,
                );
                return collection !== null && collection !== undefined;
            },
        },
    };
}

export function deleteCollection(collection) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.DELETE_COLLECTION,
                types.DELETE_COLLECTION_SUCCESS,
                types.DELETE_COLLECTION_FAILURE,
            ],
            remote: client => requests.deleteCollection(client, collection),
        },
    };
}

import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';
import { retrieveCollection } from '../reducers/denormalizations';

export function showCreateCollectionModal() {
    return {type: types.SHOW_CREATE_COLLECTION_MODAL};
}

export function hideCreateCollectionModal() {
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

export function updateCollection(collection) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_COLLECTION,
                types.UPDATE_COLLECTION_SUCCESS,
                types.UPDATE_COLLECTION_FAILURE,
            ],
            remote: client => requests.updateCollection(client, collection),
        },
    };
}

/**
 * Show the rearrange collections modal
 *
 * @return {Object} redux action
 */
export function showRearrangeCollectionsModal() {
    return {type: types.MODAL_REARRANGE_COLLECTIONS_SHOW};
}

/**
 * Hide the rearrange collections modal
 *
 * @return {Object} redux action
 */
export function hideRearrangeCollectionsModal() {
    return {type: types.MODAL_REARRANGE_COLLECTIONS_HIDE};
}

/**
 * Show the edit collection modal
 *
 * @return {Object} redux action
 */
export function showEditCollectionModal() {
    return {type: types.SHOW_EDIT_COLLECTION_MODAL};
}

/**
 * Hide the edit collection modal
 *
 * @return {Object} redux action
 */
export function hideEditCollectionModal() {
    return {type: types.HIDE_EDIT_COLLECTION_MODAL};
}

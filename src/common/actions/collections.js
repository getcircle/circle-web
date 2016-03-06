import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';
import { retrieveCollection } from '../reducers/denormalizations';

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

export function addPostToCollections(post, collections) {
    const item = new services.post.containers.CollectionItemV1({
        /*eslint-disable camelcase*/
        source_id: post.id,
        /*eslint-enable camelcase*/
    });
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.ADD_TO_COLLECTIONS,
                types.ADD_TO_COLLECTIONS_SUCCESS,
                types.ADD_TO_COLLECTIONS_FAILURE,
            ],
            remote: client => requests.addToCollections(client, item, collections),
        },
    };
}

export function removePostFromCollections(post, collections) {
    const item = new services.post.containers.CollectionItemV1({
        /*eslint-disable camelcase*/
        source_id: post.id,
        /*eslint-enable camelcase*/
    });
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.REMOVE_FROM_COLLECTIONS,
                types.REMOVE_FROM_COLLECTIONS_SUCCESS,
                types.REMOVE_FROM_COLLECTIONS_FAILURE,
            ],
            remote: client => requests.removeFromCollections(client, item, collections),
        },
    };
}

export function getCollections({source, sourceId}) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_COLLECTIONS,
                types.GET_COLLECTIONS_SUCCESS,
                types.GET_COLLECTIONS_FAILURE,
            ],
            remote: client => requests.getCollections(client, {source, sourceId}),
            bailout: state => {
                const collections = state.get('postCollections').get(sourceId);
                return collections && collections.get('loaded');
            }
        },
    };
}

export function getEditableCollections(profileId) {
    const permissions = new services.common.containers.PermissionsV1({
        /*eslint-disable camelcase*/
        can_edit: true,
        /*eslint-enable camelcase*/
    });
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_EDITABLE_COLLECTIONS,
                types.GET_EDITABLE_COLLECTIONS_SUCCESS,
                types.GET_EDITABLE_COLLECTIONS_FAILURE,
            ],
            remote: client => requests.getCollections(client, {profileId, permissions}),
            bailout: state => state.get('editableCollections').get('loaded'),
        },
    };
}

export function filterCollections(query) {
    return {type: types.FILTER_COLLECTIONS, payload: query};
}

export function clearCollectionsFilter() {
    return {type: types.CLEAR_COLLECTIONS_FILTER};
}

export function initializeCollectionsFilter(collections) {
    return {type: types.INITIALIZE_COLLECTIONS_FILTER, payload: collections};
}

export function getCollectionItems(collectionId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_COLLECTION_ITEMS,
                types.GET_COLLECTION_ITEMS_SUCCESS,
                types.GET_COLLECTION_ITEMS_FAILURE,
            ],
            remote: client => requests.getCollectionItems(client, collectionId),
        },
        meta: {
            paginateBy: collectionId,
        },
    };
}

export function getCollectionsForOwner(ownerType, ownerId, isDefault = false, nextRequest) {
    const key = requests.getCollectionsForOwnerKey(ownerType, ownerId, isDefault);
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_COLLECTIONS_FOR_OWNER,
                types.GET_COLLECTIONS_FOR_OWNER_SUCCESS,
                types.GET_COLLECTIONS_FOR_OWNER_FAILURE,
            ],
            remote: client => requests.getCollectionsForOwner(
                client,
                ownerType,
                ownerId,
                isDefault,
                nextRequest,
            ),
        },
        meta: {
            paginateBy: key,
        },
    };
}

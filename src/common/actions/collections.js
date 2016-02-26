import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';
import { retrieveCollection } from '../reducers/denormalizations';

const { SourceV1 } = services.post.containers.CollectionItemV1;

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

export function addPostToCollection(post, collection) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.ADD_TO_COLLECTION,
                types.ADD_TO_COLLECTION_SUCCESS,
                types.ADD_TO_COLLECTION_FAILURE,
            ],
            remote: client => requests.addToCollection(client, {
                source: SourceV1.LUNO,
                sourceId: post.id,
                collectionId: collection.id,
            }),
        },
    };
}

export function removeFromCollection({collectionId, collectionItemId}) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.REMOVE_FROM_COLLECTION,
                types.REMOVE_FROM_COLLECTION_SUCCESS,
                types.REMOVE_FROM_COLLECTION_FAILURE,
            ],
            remote: client => requests.removeFromCollection(client, {collectionId, collectionItemId}),
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
            bailout: state => !!state.get('editableCollections').get('collections').size,
        },
    };
}

export function filterCollections(query) {
    return {type: types.FILTER_COLLECTIONS, payload: query};
}

export function clearCollectionsFilter() {
    return {type: types.CLEAR_COLLECTIONS_FILTER};
}

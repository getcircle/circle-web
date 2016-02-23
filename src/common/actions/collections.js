import * as types from '../constants/actionTypes';

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

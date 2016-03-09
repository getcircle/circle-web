import { isEqual } from 'lodash';
import Immutable from 'immutable';
import { services } from 'protobufs';

import { addPostToCollections, removePostFromCollections } from '../actions/collections';

export function updateCollections(dispatch, post, initialCollections = [], collections = []) {
    const collectionsToAdd = [];
    const collectionsToRemove = [];
    const initialCollectionIds = initialCollections.map(collection => collection.id);
    const collectionIds = collections.map(collection => collection.id);
    for (let collection of collections) {
        if (!initialCollectionIds.includes(collection.id)) {
            collectionsToAdd.push(collection);
        }
    }

    for (let collection of initialCollections) {
        if (!collectionIds.includes(collection.id)) {
            collectionsToRemove.push(collection);
        }
    }

    if (collectionsToRemove.length) {
        dispatch(removePostFromCollections(post, collectionsToRemove));
    }

    if (collectionsToAdd.length) {
        dispatch(addPostToCollections(post, collectionsToAdd));
    }
}

export function getPositionDiffs(newItems, initialItems) {
    const items = Immutable.Map().asMutable();
    for (let index in newItems) {
        const item = newItems[index];
        items.setIn([item.id, 'newPosition'], index);
    }

    const initialItemsWithoutRemoved = [];
    for (let item of initialItems) {
        if (items.has(item.id)) {
            initialItemsWithoutRemoved.push(item);
        }
    }

    if (isEqual(newItems, initialItemsWithoutRemoved)) {
        return [];
    }

    for (let index in initialItemsWithoutRemoved) {
        const item = initialItemsWithoutRemoved[index];
        items.setIn([item.id, 'currentPosition'], index);
    }

    const diffs = [];
    for (let item of newItems) {
        const positions = items.get(item.id);
        if (positions.get('currentPosition') !== positions.get('newPosition')) {
            const diff = new services.post.actions.reorder_collection.PositionDiffV1({
                /*eslint-disable camelcase*/
                item_id: item.id,
                current_position: parseInt(positions.get('currentPosition')),
                new_position: parseInt(positions.get('newPosition')),
                /*eslint-enable camelcase*/
            });
            diffs.push(diff);
        }
    }
    return diffs;
}

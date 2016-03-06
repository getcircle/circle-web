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

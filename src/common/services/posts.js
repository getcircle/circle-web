import { merge } from 'lodash';
import { services } from 'protobufs';

import { getPostsPaginationKey } from '../actions/posts';

import { getPostStateURLString, getPostStateFromURLString } from '../utils/post';

export function createPost(client, post) {
    const request = new services.post.actions.create_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                const { post } = response.result;
                response.finish(resolve, reject, post.id, { post });
            })
            .catch(error => reject(error));
    });
}

export function updatePost(client, post) {
    const request = new services.post.actions.update_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, post.id))
            .catch(error => reject(error));
    });
}

export function deletePost(client, post) {
    const request = new services.post.actions.delete_post.RequestV1({id: post.id});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.simple(resolve, reject, { post }))
            .catch(error => reject(error));
    });
}

export function getPost(
        client,
        postId,
        fields=new services.common.containers.FieldsV1({exclude: ['snippet']}),
        inflations=new services.common.containers.InflationsV1({exclude: ['html_document']})
    ) {
    let parameters = {
        id: postId,
        fields: fields,
        inflations: inflations,
    };

    let request = new services.post.actions.get_post.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, postId))
            .catch(error => reject(error));
    });
}

export function getPosts(args) {
    let {
        client,
        profileId,
        state,
        nextRequest = null,
        inflations = new services.common.containers.InflationsV1({disabled: true}),
        fields = new services.common.containers.FieldsV1({exclude: ['content']}),
        key = getPostsPaginationKey(profileId, state),
    } = args;

    let parameters = {
        /*eslint-disable camelcase*/
        by_profile_id: profileId ? profileId : undefined,
        state: state,
        inflations: inflations,
        fields: fields,
        /*eslint-enable camelcase*/
    };

    const request = nextRequest ? nextRequest : new services.post.actions.get_posts.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

export function createCollection(client, collection) {
    const request = new services.post.actions.create_collection.RequestV1({collection});
    return new Promise((resolve, reject) => {
        client.send(request)
            .then((response) => {
                const { collection } = response.result;
                response.finish(resolve, reject, collection.id, { collection });
            })
            .catch(error => reject(error));
    });
}

export function getCollection(client, collectionId) {
    const request = new services.post.actions.get_collection.RequestV1({
        /*eslint-disable camelcase*/
        collection_id: collectionId,
        inflations: new services.common.containers.InflationsV1({exclude: ['items', 'display_name']}),
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, collectionId))
            .catch(error => reject(error));
    });
}

export function deleteCollection(client, collection) {
    const request = new services.post.actions.delete_collection.RequestV1({
        /*eslint-disable camelcase*/
        collection_id: collection.id,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.simple(resolve, reject, { collection }))
            .catch(error => reject(error));
    });
}

export function updateCollection(client, collection, itemsToRemove, diffs) {
    function removeItems() {
        let promises = [];
        // TODO this should be a batch operation
        for (let item of itemsToRemove) {
            promises.push(removeFromCollections(client, item, [collection]));
        }
        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(values => {
                    const payload = {removedItems: [], collection: collection};
                    for (let value of values) {
                        payload.removedItems.push(value.item);
                    }
                    resolve(payload);
                })
                .catch(error => reject(error));
        });
    }

    function reorderCollection() {
        const request = new services.post.actions.reorder_collection.RequestV1({
            /*eslint-disable camelcase*/
            diffs,
            collection_id: collection.id,
            /*eslint-enable camelcase*/
        });
        return new Promise((resolve, reject) => {
            client.send(request)
                .then(response => response.finish(resolve, reject, collection.id, { diffs }))
                .catch(error => reject(error));
        });
    }

    function updateCollection() {
        const request = new services.post.actions.update_collection.RequestV1({collection});
        return new Promise((resolve, reject) => {
            client.send(request)
                .then(response => response.finish(resolve, reject, collection.id))
                .catch(error => reject(error));
        });
    }

    let promises = [];
    promises.push(updateCollection());

    if (diffs && diffs.length) {
        promises.push(reorderCollection());
    }

    return new Promise((resolve, reject) => {
        // We don't fire all these promises at once since we could be removing and
        // re-ordering items from the collection
        const results = [];
        updateCollection()
            .then(result => {
                results.push(result);
                if (itemsToRemove && itemsToRemove.length) {
                    return removeItems();
                } else {
                    return Promise.resolve({});
                }
            })
            .then(result => {
                results.push(result);
                if (diffs && diffs.length) {
                    return reorderCollection();
                } else {
                    return Promise.resolve({});
                }
            })
            .then(result => {
                results.push(result);
                resolve(merge(...results));
            })
            .catch(error => reject(error));
    });
}

function sendAddToCollectionsRequest(client, item, collections) {
    const request = new services.post.actions.add_to_collections.RequestV1({
        item,
        collections,
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then((response) => {
                return response.finish(resolve, reject, item.source_id, {
                    item,
                    collections: request.collections,
                });
            })
            .catch(error => reject(error));
    })
}

export function addToCollections(client, item, collections) {
    return new Promise((resolve, reject) => {
        const existingCollections = collections.filter(c => c.id !== null)
        const newCollections = collections.filter(c => c.id === null)
        const promises = newCollections.map(c => createCollection(client, c))
        Promise.all(promises)
            .then(createResponses => {
                const createdCollections = createResponses.map(r => r.collection);
                const collectionsToSend = existingCollections.concat(createdCollections);
                sendAddToCollectionsRequest(client, item, collectionsToSend)
                    .then(response => {
                        resolve(merge(...createResponses, response));
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
}

export function removeFromCollections(client, item, collections) {
    const request = new services.post.actions.remove_from_collections.RequestV1({
        item,
        collections,
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.simple(resolve, reject, {item, collections, result: item.source_id}))
            .catch(error => reject(error));
    });
}

export function getCollections(client, parameters) {
    const { source, sourceId, profileId, permissions } = parameters;
    const request = new services.post.actions.get_collections.RequestV1({
        /*eslint-disable camelcase*/
        permissions,
        source,
        source_id: sourceId,
        profile_id: profileId,
        inflations: new services.common.containers.InflationsV1({exclude: ['items']}),
        /*eslint-enable camelcase*/
    });

    const key = sourceId ? sourceId : profileId;
    return new Promise((resolve, reject) => {
        client.send(request, true)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

export function getCollectionItems(client, collectionId, nextRequest) {
    const request = nextRequest ? nextRequest : new services.post.actions.get_collection_items.RequestV1({
        /*eslint-disable camelcase*/
        collection_id: collectionId,
        inflations: new services.common.containers.InflationsV1({exclude: ['post.html_document']}),
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, collectionId))
            .catch(error => reject(error));
    });
}

export function getCollectionsForOwnerKey(ownerType, ownerId, isDefault = false) {
    ownerType = ownerType === null ? services.post.containers.CollectionV1.OwnerTypeV1.PROFILE : ownerType;
    return isDefault ? `${ownerType}:${ownerId}:default` : `${ownerType}:${ownerId}`;
}

export function getCollectionsForOwner(client, ownerType, ownerId, isDefault, nextRequest) {
    const request = nextRequest ? nextRequest : new services.post.actions.get_collections.RequestV1({
        /*eslint-disable camelcase*/
        owner_type: ownerType,
        owner_id: ownerId,
        is_default: isDefault,
        items_per_collection: 3,
        /*eslint-enable camelcase*/
    });
    const key = getCollectionsForOwnerKey(ownerType, ownerId, isDefault);
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
};

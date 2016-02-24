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
                response.finish(resolve, reject, collection.id);
            })
            .catch(error => reject(error));
    });
}

export function getCollection(client, collectionId) {
    const request = new services.post.actions.get_collection.RequestV1({
        /*eslint-disable camelcase*/
        collection_id: collectionId,
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

export function updateCollection(client, collection) {
    const request = new services.post.actions.update_collection.RequestV1({collection});
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, collection.id))
            .catch(error => reject(error));
    });
}

export function addToCollection(client, parameters) {
    const { collectionId, source, sourceId, isDefault, ownerId, ownerType } = parameters;
    const request = new services.post.actions.add_to_collection.RequestV1({
        /*eslint-disable camelcase*/
        collection_id: collectionId,
        source: source,
        source_id: sourceId,
        is_default: isDefault,
        owner_id: ownerId,
        owner_type: ownerType,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then((response) => {
                const { item } = response.result;
                return response.finish(resolve, reject, item.id, { item });
            })
            .catch(error => reject(error));
    });
}

export function removeFromCollection(client, parameters) {
    const { collectionId, collectionItemId } = parameters;
    const request = new services.post.actions.remove_from_collection.RequestV1({
        /*eslint-disable*/
        collection_id: collectionId,
        collection_item_id: collectionItemId,
        /*eslint-enable*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.simple(resolve, reject, parameters))
            .catch(error => reject(error));
    });
}

export function getCollections(client, parameters) {
    const { source, sourceId } = parameters;
    const request = new services.post.actions.get_collections.RequestV1({
        /*eslint-disable camelcase*/
        source,
        source_id: sourceId,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, sourceId))
            .catch(error => reject(error));
    });
}

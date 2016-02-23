import { services } from 'protobufs';

import { getPostsPaginationKey } from '../actions/posts';

import { getPostStateURLString, getPostStateFromURLString } from '../utils/post';

export function createPost(client, post) {
    let request = new services.post.actions.create_post.RequestV1({post: post});
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
    let request = new services.post.actions.update_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, post.id))
            .catch(error => reject(error));
    });
}

export function deletePost(client, post) {
    let request = new services.post.actions.delete_post.RequestV1({id: post.id});
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

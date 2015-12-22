import { services } from 'protobufs';

import { getPostStateURLString, getPostStateFromURLString } from '../utils/post';

export function createPost(client, post) {
    let request = new services.post.actions.create_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                const { post } = response.result;
                resolve({post})
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
            .then(response => {
                if (response.isSuccess()) {
                    resolve({
                        postId: post.id,
                        postState: getPostStateURLString(post.state),
                    });
                } else {
                    reject('Post wasn\'t deleted');
                }
            })
            .catch(error => reject(error));
    });
}

export function getPost(client, postId, fields=new services.common.containers.FieldsV1({exclude: ['snippet']})) {
    let parameters = {
        id: postId,
        fields: fields,
    };

    let request = new services.post.actions.get_post.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, postId))
            .catch(error => reject(error));
    });
}

export function getPosts(client, postStateURLString, byProfile, nextRequest=null, key=null, fields=new services.common.containers.FieldsV1({exclude: ['content']})) {

    let parameters = {
        /*eslint-disable camelcase*/
        by_profile_id: byProfile ? byProfile.id : undefined,
        state: getPostStateFromURLString(postStateURLString),
        fields: fields,
        /*eslint-enable camelcase*/
    };

    if (key === null) {
        key = postStateURLString;
    }

    const request = nextRequest ? nextRequest : new services.post.actions.get_posts.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

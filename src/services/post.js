import { services } from 'protobufs';

import client from './client';

export function createPost(post) {
    let request = new services.post.actions.create_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                let post = response.result.post;
                resolve({post})
            })
            .catch(error => reject(error));
    });
}

export function updatePost(post) {
    let request = new services.post.actions.update_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, post))
            .catch(error => reject(error));
    });
}

export function deletePost(postId) {
    let request = new services.post.actions.delete_post.RequestV1({id: postId});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject))
            .catch(error => reject(error));
    });
}

export function getPost(postId) {
    let request = new services.post.actions.get_post.RequestV1({id: postId});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, postId))
            .catch(error => reject(error));
    });
}

export function getPosts(byProfileId, state, nextRequest=null) {

    /*eslint-disable camelcase*/
    let parameters = {
        by_profile_id: byProfileId,
        state: state,
    };
    /*eslint-enable camelcase*/

    const request = nextRequest ? nextRequest : new services.post.actions.get_posts.RequestV1(parameters);
    let key = byProfileId;

    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

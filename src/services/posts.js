import { services } from 'protobufs';

import { getPostStateFromURLString } from '../utils/post';

import client from './client';

export function createPost(post) {
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

export function updatePost(post) {
    let request = new services.post.actions.update_post.RequestV1({post: post});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, post))
            .catch(error => reject(error));
    });
}

export function deletePost(post) {
    let request = new services.post.actions.delete_post.RequestV1({id: post.id});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                if (response.isSuccess()) {
                    resolve({
                        postId: post.id,
                        postState: post.state.toString(),
                    });
                } else {
                    reject('Post wasn\'t deleted');
                }
            })
            .catch(error => reject(error));
    });
}

export function getPost(postId) {
    let request = new services.post.actions.get_post.RequestV1({id: postId});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                response.finish(resolve, reject, postId);
            })
            .catch(error => reject(error));
    });
}

export function getPosts(postStateURLString, nextRequest=null) {

    let parameters = {
        state: getPostStateFromURLString(postStateURLString),
    };

    const request = nextRequest ? nextRequest : new services.post.actions.get_posts.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, postStateURLString))
            .catch(error => reject(error));
    });
}

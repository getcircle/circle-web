import faker from 'faker';
import { services } from 'protobufs';

import ProfileFactory from './ProfileFactory';

class PostFactory {

    constructor() {
        this._post = new services.post.containers.PostV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            state: services.post.containers.PostStateV1.DRAFT,
            title: 'This is test title of a post',
            content: 'This is test content of a post',
            by_profile: ProfileFactory.getProfile(),
            changed: '2015-11-05 01:09:00.099535+00',
            /*eslint-enable camelcase*/
        });
    }

    getPost() {
        return this._post;
    }

    getPostWithTitleAndContent(title, content) {
        return Object.assign({}, this._post, {
            title: title,
            content: content,
        });
    }

    getPostWithPermissions(canEdit, canDelete) {
        return Object.assign({}, this._post, {
            /*eslint-disable camelcase*/
            permissions: {
                can_edit: canEdit,
                can_delete: canDelete,
            },
            /*eslint-enable camelcase*/
        });
    }

    getPostWithState(state) {
        return Object.assign({}, this._post, {
            state: state,
        });
    }
}

export default new PostFactory();

import faker from 'faker';
import { services } from 'protobufs';

import ProfileFactory from './ProfileFactory';

export default {

    getPost(overrides) {
        return new services.post.containers.PostV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            state: services.post.containers.PostStateV1.DRAFT,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            by_profile: ProfileFactory.getProfile(),
            changed: '2015-11-05 01:09:00.099535+00',
            /*eslint-enable camelcase*/
            ...overrides,
        });
    },

    getPostWithTitleAndContent(title, content) {
        return this.getPost({title, content});
    },

    getPostWithPermissions(canEdit, canDelete) {
        return this.getPost({
            permissions: {
                /*eslint-disable camelcase*/
                can_edit: canEdit,
                can_delete: canDelete,
                /*eslint-enable camelcase*/
            }
        });
    },

    getPostWithState(state) {
        return this.getPost({state});
    },
}

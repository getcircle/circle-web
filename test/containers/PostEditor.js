import expect from 'expect';
import faker from 'faker';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import PostFactory from '../factories/PostFactory';
import ProfileFactory from '../factories/ProfileFactory';

import { PostEditor } from '../../src/containers/PostEditor';

function setup(propOverrides) {
    const defaultProps = {
        authenticatedProfile: ProfileFactory.getProfile(),
        dispatch: expect.createSpy(),
        largerDevice: true,
        post: null,
        params: {
            postId: null,
        },
    }

    const props = Object.assign({}, defaultProps, propOverrides);
    const postEditorComponent = TestUtils.renderIntoDocument(<PostEditor {...props} />);

    return {
        postEditorComponent,
        props,
    };
}

describe('PostEditorComponent', () => {

    it('makes new posts editable by default', () => {
        const { postEditorComponent } = setup();
        expect(postEditorComponent.canEdit()).toBe(true);
    });

    it('does not allow editing unless a post object is present', () => {
        const { postEditorComponent } = setup({
            params: {
                postId: faker.random.uuid(),
            },
        });
        expect(postEditorComponent.canEdit()).toBe(false);
    });

    it('does not allow editing if can_edit permission is false', () => {
        const { postEditorComponent } = setup({
            params: {
                postId: faker.random.uuid(),
            },
            post: PostFactory.getPostWithPermissions(false, false),
        });
        expect(postEditorComponent.canEdit()).toBe(false);
    });

    it('allows editing if can_edit permission is true', () => {
        const { postEditorComponent } = setup({
            params: {
                postId: faker.random.uuid(),
            },
            post: PostFactory.getPostWithPermissions(true, false),
        });
        expect(postEditorComponent.canEdit()).toBe(true);
    });
});

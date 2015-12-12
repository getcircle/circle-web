import expect from 'expect';
import faker from 'faker';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { PostEditor } from '../../../src/common/containers/PostEditor';

import componentWithContext from '../../componentWithContext';
import OrganizationFactory from '../../factories/OrganizationFactory';
import PostFactory from '../../factories/PostFactory';
import ProfileFactory from '../../factories/ProfileFactory';


function setup(propsOverrides, contextOverrides, post) {

    // Props
    const props = {
        dispatch: expect.createSpy(),
        organization: OrganizationFactory.getOrganization(),
        post: null,
        params: {
            postId: null,
        },
        profile: ProfileFactory.getProfile(),
        ...propsOverrides,
    }
    const Container = componentWithContext(<PostEditor {...props} />);
    let container = TestUtils.renderIntoDocument(<Container />);
    const postEditorComponent = TestUtils.findRenderedComponentWithType(container, PostEditor);
    return {
        postEditorComponent,
        props,
        container,
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

import expect from 'expect';
import faker from 'faker';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import TestUtils from 'react-addons-test-utils';

import OrganizationFactory from '../../factories/OrganizationFactory';
import PostFactory from '../../factories/PostFactory';
import ProfileFactory from '../../factories/ProfileFactory';

import CSSComponent from '../../../src/common/components/CSSComponent';
import { PostEditor } from '../../../src/common/containers/PostEditor';

function setup(propsOverrides, contextOverrides) {

    // Props
    const defaultProps = {
        authenticated: true,
        authenticatedProfile: ProfileFactory.getProfile(),
        dispatch: expect.createSpy(),
        largerDevice: true,
        mobileOS: false,
        organization: OrganizationFactory.getOrganization(),
        post: null,
        params: {
            postId: null,
        },
        profile: ProfileFactory.getProfile(),
    }
    const props = Object.assign({}, defaultProps, propsOverrides);

    // Context
    const defaultContext = {
        history: {
            pushState: expect.createSpy(),
        },
        mixins: {},
    };

    const context = Object.assign({}, defaultContext, contextOverrides);
    class PostEditorTestContainer extends CSSComponent {

        static childContextTypes = {
            history: PropTypes.shape({
                pushState: PropTypes.func.isRequired,
            }).isRequired,
            mixins: PropTypes.object.isRequired,
        }

        getChildContext() {
            return context;
        }

        render() {
            return (
                <PostEditor {...props} />
            );
        }
    }

    let container = TestUtils.renderIntoDocument(<PostEditorTestContainer />);
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

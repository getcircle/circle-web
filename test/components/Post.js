import expect from 'expect';
import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import TestUtils from 'react-addons-test-utils';

import PostFactory from '../factories/PostFactory';
import ProfileFactory from '../factories/ProfileFactory';

import AutogrowTextarea from '../../src/components/AutogrowTextarea';
import CSSComponent from '../../src/components/CSSComponent';
import Post from '../../src/components/Post';

const { PostStateV1 } = services.post.containers;

function setup(propsOverrides, contextOverrides) {

    // Props
    const defaultProps = {
        largerDevice: true,
        onSaveCallback: expect.createSpy(),
        post: PostFactory.getPostWithTitleAndContent('', ''),
    }
    const props = Object.assign({}, defaultProps, propsOverrides);

    // Context
    const defaultContext = {
        authenticatedProfile: ProfileFactory.getProfile(),
        history: {
            pushState: expect.createSpy(),
        },
    };
    const context = Object.assign({}, defaultContext, contextOverrides);

    class PostTestContainer extends CSSComponent {

        static childContextTypes = {
            authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
            history: PropTypes.shape({
                pushState: PropTypes.func.isRequired,
            }).isRequired,
        }

        getChildContext() {
            return context;
        }

        render() {
            return (
                <Post {...props} />
            );
        }
    }

    let container = TestUtils.renderIntoDocument(<PostTestContainer />);
    const postComponent = TestUtils.findRenderedComponentWithType(container, Post);
    return {
        postComponent,
        props,
        container,
    };
}

describe('PostComponent', () => {

    describe('readonlyContent', () => {

        it('does not add any input elements when viewing body', () => {
            const { postComponent } = setup({isEditable: false});
            let textareas = TestUtils.scryRenderedComponentsWithType(postComponent, AutogrowTextarea);
            expect(textareas.length).toBe(0);
        });

        it('detects URLs and emails in readonly content and adds markup', () => {
            const postContent = 'This is a sample post content. For more details checkout - https://lunohq.com ' +
            'If you have any questions, contact ravi@lunohq.com or michael@lunohq.com';
            const { postComponent } = setup({
                isEditable: false,
                post: PostFactory.getPostWithTitleAndContent('', postContent),
            });

            const postContentComponent = TestUtils.findRenderedDOMComponentWithClass(postComponent, 'postContent');
            expect(TestUtils.isDOMComponent(postContentComponent)).toBe(true);

            expect((ReactDOM.findDOMNode(postContentComponent)).innerHTML).toBe(
                'This is a sample post content. For more details checkout - ' +
                '<a href="https://lunohq.com" target="_blank">https://lunohq.com</a> ' +
                'If you have any questions, contact <a href="mailto:ravi@lunohq.com">ravi@lunohq.com</a> or ' +
                '<a href="mailto:michael@lunohq.com">michael@lunohq.com</a>'
            );
        });

    });

    describe('when editingContent', () => {

        it('adds explicit Publish button when editing a post', () => {
            const { postComponent } = setup({
                autoSave: false,
                isEditable: true,
            });

            expect(postComponent.refs.publishButton).toExist();
        });

        it('correctly returns current title and body', () => {
            const { postComponent } = setup({
                isEditable: true,
            });

            const testTitle = 'This is a test title';
            const testBody = 'This is test body';
            let textareas = TestUtils.scryRenderedComponentsWithType(postComponent, AutogrowTextarea);

            const titleInput = ReactDOM.findDOMNode(textareas[0].refs.input);
            titleInput.value = testTitle;
            TestUtils.Simulate.change(titleInput);
            expect(postComponent.getCurrentTitle()).toBe(testTitle);

            const bodyInput = ReactDOM.findDOMNode(textareas[1].refs.input);
            bodyInput.value = testBody;
            TestUtils.Simulate.change(bodyInput);
            expect(postComponent.getCurrentBody()).toBe(testBody);
        });

        it('has input areas for title and body', () => {
            const { postComponent } = setup({isEditable: true});
            let textareas = TestUtils.scryRenderedComponentsWithType(postComponent, AutogrowTextarea);
            expect(textareas.length).toBe(2);
        });

        it('adds title from body if its not set', () => {
            const { postComponent } = setup();
            const testTitle = 'This is a test body body with title as the first line';
            const testBody = testTitle + '. Actual body starts here.';

            postComponent.handleBodyChange({}, testBody);
            expect(postComponent.state.title).toBe(testTitle);
            expect(postComponent.state.body).toBe(testBody);
            expect(postComponent.state.editing).toBe(true);
            expect(postComponent.state.derivedTitle).toBe(true);
        });

        it('calls onSaveCallback when saving explicitly', () => {
            const { postComponent, props } = setup({
                autoSave: false,
                isEditable: true,
            });

            postComponent.saveData(true);
            expect(props.onSaveCallback.calls.length).toBe(1);

            postComponent.refs.publishButton.props.onTouchTap();
            expect(props.onSaveCallback.calls.length).toBe(2);
        });

        it('does not allows changing owner if post is in draft state', () => {
            const adminProfile = ProfileFactory.getAdminProfile();
            const { postComponent, props } = setup({
                autoSave: false,
                isEditable: true,
            }, {
                authenticatedProfile: adminProfile,
            });

            expect(props.post.state).toBe(PostStateV1.DRAFT);
            expect(postComponent.shouldAllowChangingOwner()).toBe(false);
            expect(adminProfile.is_admin).toBe(true);
        });

        it('does not allows changing owner if logged in user is not an admin user', () => {
            const { postComponent, props } = setup({
                autoSave: false,
                isEditable: true,
                post: PostFactory.getPostWithState(PostStateV1.LISTED),
            });

            expect(postComponent.shouldAllowChangingOwner()).toBe(false);
            expect(props.post.state).toBe(PostStateV1.LISTED);
        });

        it('allows changing owner if logged in user is an admin user and post is published', () => {
            const adminProfile = ProfileFactory.getAdminProfile();
            const { postComponent, props } = setup({
                autoSave: false,
                isEditable: true,
                post: PostFactory.getPostWithState(PostStateV1.LISTED),
            }, {
                authenticatedProfile: adminProfile,
            });

            expect(postComponent.shouldAllowChangingOwner()).toBe(true);
            expect(props.post.state).toBe(PostStateV1.LISTED);
            expect(adminProfile.is_admin).toBe(true);
        });

    });

});

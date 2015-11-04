import expect from 'expect';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import ProfileFactory from '../factories/ProfileFactory';

import AutogrowTextarea from '../../src/components/AutogrowTextarea';
import CSSComponent from '../../src/components/CSSComponent';
import Post from '../../src/components/Post';

const { TestUtils } = React.addons;

function setup(propsOverrides, contextOverrides) {

    // Props
    const defaultProps = {
        largerDevice: true,
        onSaveCallback: expect.createSpy(),
    }
    const props = Object.assign({}, defaultProps, propsOverrides);

    // Context
    const defaultContext = {
        authenticatedProfile: ProfileFactory.getProfile(),
        router: {
            transitionTo: expect.createSpy(),
        },
    };
    const context = Object.assign({}, defaultContext, contextOverrides);

    class PostTestContainer extends CSSComponent {

        static childContextTypes = {
            authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
            router: PropTypes.shape({
                transitionTo: PropTypes.func.isRequired,
            }).isRequired,
        }

        getChildContext() {
            return context;
        }

        render() {
            return (<Post {...props} />);
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

    });

    describe('editingContent', () => {

        it('adds explicit Publish button when editing a post', () => {
            const { postComponent } = setup({
                autoSave: false,
                isEditable: true,
                post: new services.post.containers.PostV1({}),
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

            const titleInput = React.findDOMNode(textareas[0].refs.input);
            titleInput.value = testTitle;
            TestUtils.Simulate.change(titleInput);
            expect(postComponent.getCurrentTitle()).toBe(testTitle);

            const bodyInput = React.findDOMNode(textareas[1].refs.input);
            bodyInput.value = testBody;
            TestUtils.Simulate.change(bodyInput);
            expect(postComponent.getCurrentBody()).toBe(testBody);
        });

        it('has input areas for title and body', () => {
            const { postComponent } = setup({isEditable: true});
            let textareas = TestUtils.scryRenderedComponentsWithType(postComponent, AutogrowTextarea);
            expect(textareas.length).toBe(2);
        });

        it('trims left title and body', () => {
            const { postComponent } = setup();
            const testTitle = '    This is a test title';
            const testBody = '     This is a test body body';
            postComponent.handleTitleChange({}, testTitle);
            expect(postComponent.state.title).toBe(testTitle.trimLeft());

            postComponent.handleBodyChange({}, testBody);
            expect(postComponent.state.body).toBe(testBody.trimLeft());
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
                post: new services.post.containers.PostV1({}),
            });

            postComponent.saveData(true);
            expect(props.onSaveCallback.calls.length).toBe(1);

            postComponent.refs.publishButton.props.onTouchTap();
            expect(props.onSaveCallback.calls.length).toBe(2);
            expect(postComponent.context.router.transitionTo.calls.length).toBe(1);
        });

    });

});

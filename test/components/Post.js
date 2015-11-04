import expect from 'expect';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import ProfileFactory from '../factories/ProfileFactory';

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

    it('adds explicit Publish button when editing a post', () => {
        const { postComponent } = setup({
            autoSave: false,
            isEditable: true,
            post: new services.post.containers.PostV1({}),
        });

        expect(postComponent.refs.publishButton).toExist();
    });

    describe('editingContent', () => {

        it('trims left title and body', () => {
            const { postComponent } = setup();
            const testTitle = '    This is a test title';
            const testContent = '     This is a test body content';
            postComponent.handleTitleChange({}, testTitle);
            expect(postComponent.state.title).toBe(testTitle.trimLeft());

            postComponent.handleBodyChange({}, testContent);
            expect(postComponent.state.body).toBe(testContent.trimLeft());
        });

        it('adds title from body if its not set', () => {
            const { postComponent } = setup();
            const testTitle = 'This is a test body content with title as the first line';
            const testContent = testTitle + '. Actual content starts here.';

            postComponent.handleBodyChange({}, testContent);
            expect(postComponent.state.title).toBe(testTitle);
            expect(postComponent.state.body).toBe(testContent);
            expect(postComponent.state.editing).toBe(true);
            expect(postComponent.state.derivedTitle).toBe(true);
        });

    });

});

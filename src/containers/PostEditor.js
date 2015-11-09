import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { clearPosts, createPost, getPost, updatePost } from '../actions/posts';
import { getPostStateURLString } from '../utils/post';
import logger from '../utils/logger';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import { trimNewLinesAndWhitespace } from '../utils/string';
import t from '../utils/gettext';
import { routeToPosts } from '../utils/routes';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import Post from '../components/Post';
import Header from '../components/Header';
import RoundedButton from '../components/RoundedButton';

const { PostV1, PostStateV1 } = services.post.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
        selectors.responsiveSelector
    ],
    (authenticationState, cacheState, postState, paramsState, responsiveState) => {

        let post;
        let postId = null;
        const cache = cacheState.toJS();

        // We get here either when editing a post or when creating a new one.
        if (paramsState && paramsState.postId) {
            postId = paramsState.postId;
            if (postState.get('ids').has(postId)) {
                post = retrievePost(postId, cache);
            }
        } else {
            post = postState.get('draftPost');
        }

        return {
            authenticatedProfile: authenticationState.get('profile'),
            isSaving: postState.get('loading'),
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            post: post,
            organization: authenticationState.get('organization'),
            shouldAutoSave: !post || (post && (!post.state || post.state === PostStateV1.DRAFT)),
        }
    }
);

class PostEditor extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        dispatch: PropTypes.func.isRequired,
        isSaving: PropTypes.bool,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        params: PropTypes.shape({
            postId: PropTypes.string,
        }),
        post: PropTypes.instanceOf(services.post.containers.PostV1),
        shouldAutoSave: PropTypes.bool,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mobileOS: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        shouldAutoSave: true,
        post: null,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            mobileOS: this.props.mobileOS,
        };
    }

    componentWillMount() {
        this.loadPost(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // If this is in edit mode, load another post if we detect a different post ID in the URL
        if (this.props.params.postId && nextProps.params.postId) {
            if (nextProps.params.postId !== this.props.params.postId) {
                this.loadPost(nextProps);
            }
        } else if (nextProps.post) {
            this.postCreationInProgress = false;
        }

        this.showProgressMessage(nextProps);
    }

    classes() {
        return {
            default: {
                Container: {
                    style: {
                        backgroundColor: 'rgb(255, 255, 255)',
                    },
                },
                headerActionButtonLabel: {
                    color: '#8598FF',
                    fontSize: 16,
                    textTransform: 'none',
                },
                headerActionButton: {
                    backgroundColor: 'transparent',
                    borderRadius: '20px',
                    border: '1px solid #8598FF',
                },
                headerActionContainer: {
                    width: '100%',
                },
                headerMessageText: {
                    backgroundColor: 'transparent',
                    border: 0,
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 14,
                },
                Post: {
                    style: {
                        backgroundColor: 'rgb(255, 255, 255)',
                    },
                }
            },
        }
    }

    postCreationInProgress = false

    loadPost(props) {
        if (props.params && props.params.postId) {
           this.props.dispatch(getPost(props.params.postId));
        }
        resetScroll();
    }

    onSavePost(title, body, postState) {
        if (title.trim() === '' || body.trim() === '') {
            return;
        }

        // TODO: Remove temp code
        // Don't save until post creation is completed
        if (this.postCreationInProgress) {
            return;
        }

        const {
            dispatch,
            post,
        } = this.props;

        const trimmedBodyValue = trimNewLinesAndWhitespace(body);
        const trimmedTitleValue = trimNewLinesAndWhitespace(title);

        if (!post) {
            logger.log('Creating new post');
            this.postCreationInProgress = true;
            let postV1 = new PostV1({
                content: trimmedBodyValue,
                title: trimmedTitleValue,
            });

            dispatch(createPost(postV1));
            dispatch(clearPosts(PostStateURLString.DRAFT));
        }
        else {
            logger.log('Saving existing post');
            let updates = {
                content: trimmedBodyValue,
                title: trimmedTitleValue,
            };

            if (postState !== undefined && postState !== null) {
                updates.state = postState;
            }

            let postV1 = Object.assign({}, post, updates);
            dispatch(updatePost(postV1));
            dispatch(clearPosts(getPostStateURLString(postV1.state)));
        }
    }

    onPublishButtonTapped() {
        // TODO: Send error message back
        if (!this.props.post) {
            return;
        }

        this.onSavePost(
            this.refs.post.getCurrentTitle(),
            this.refs.post.getCurrentBody(),
            PostStateV1.LISTED,
        );
        this.props.dispatch(clearPosts());
        routeToPosts(this.context.router, PostStateURLString.LISTED);
    }

    canEdit() {
        const {
            params,
            post,
        } = this.props;

        // Post is being edited
        if (params && params.postId) {
            if (post && post.permissions && post.permissions.can_edit) {
                return true;
            }
        } else {
            // New post is being created.
            return true;
        }

        return false;
    }

    showProgressMessage(props) {
        const {
            isSaving,
            post,
            shouldAutoSave,
        } = props;

        let postType = '';
        if (!post ||
            (post && (post.state === null || post.state === PostStateV1.DRAFT))
        ) {
            postType = t('Draft');
        }

        if (shouldAutoSave && isSaving) {
            postType += ` ${t('Saving')}\u2026`;
        }

        if (this.refs.headerMessageText) {
            this.refs.headerMessageText.getDOMNode().value = postType;
        }
    }

    renderPublishButton() {
        if (this.props.shouldAutoSave) {
            return (
                <div>
                    <RoundedButton
                        label={t('Publish')}
                        onTouchTap={::this.onPublishButtonTapped}
                    />
                </div>
            );
        }
    }

    renderHeaderActionsContainer() {
        if (this.canEdit()) {
            return (
                <div className="row middle-xs between-xs" is="headerActionContainer">
                    <div>
                        <input disabled={true} is="headerMessageText" ref="headerMessageText" />
                    </div>
                    {this.renderPublishButton()}
                </div>
            );
        }
    }

    renderPost() {
        const {
            largerDevice,
            params,
            post,
            shouldAutoSave,
        } = this.props;

        if (params && params.postId && !post) {
            return <CenterLoadingIndicator />;
        }

        return (
            <Post
                autoSave={shouldAutoSave}
                is="Post"
                isEditable={this.canEdit()}
                largerDevice={largerDevice}
                onSaveCallback={::this.onSavePost}
                post={post}
                ref="post"
            />
        );
    }

    render() {
        const {
            authenticatedProfile,
        } = this.props;

        return (
            <Container is="Container">
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                {this.renderPost()}
            </Container>
        );
    }
}

// Exporting the Redux store connected and the pure component separately allows
// us to test the component individually rather than relying on the store
// passing down the state.
export { PostEditor };
export default connect(selector)(PostEditor);

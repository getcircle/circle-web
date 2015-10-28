import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { createPost, getPost, getPosts, updatePost } from '../actions/posts';
import logger from '../utils/logger';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
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
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            post: post,
            organization: authenticationState.get('organization'),
        }
    }
);

@connect(selector)
class PostEditor extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        params: PropTypes.shape({
            postId: PropTypes.string,
        }),
        post: PropTypes.instanceOf(services.post.containers.PostV1),
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
        post: null,
    }

    state = {
        saving: false,
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

    componentWillReceiveProps(nextProps, nextState) {
        // If this is in edit mode, load another post if we detect a different post ID in the URL
        if (this.props.params.postId && nextProps.params.postId) {
            if (nextProps.params.postId !== this.props.params.postId) {
                this.loadPost(nextProps);
            }
        } else if (nextProps.post) {
            this.postCreationInProgress = false;
        }

        this.setState({saving: false});
    }

    classes() {
        return {
            default: {
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
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 14,
                    marginRight: '20px',
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

    onSavePost(title, body) {
        logger.log('Saving Post');
        logger.log(body);

        if (title.trim() === '' || body.trim() === '') {
            return;
        }

        // TODO: Remove temp code
        // Don't save until post creation is completed
        if (this.postCreationInProgress) {
            return;
        }

        this.setState({saving: true});

        if (!this.props.post) {
            logger.log('CREATING NEW POST');
            this.postCreationInProgress = true;
            let postV1 = new PostV1({
                content: body,
                title: title,
            });

            this.props.dispatch(createPost(postV1));
        }
        else {
            logger.log('SAVING EXISTING POST');
            let postV1 = Object.assign({}, this.props.post, {
                content: body,
                title: title,
            });
            this.props.dispatch(updatePost(postV1));
        }
    }

    onPublishButtonTapped() {
        // TODO: Send error message back
        if (!this.props.post) {
            return;
        }

        let postV1 = Object.assign({}, this.props.post, {
            state: PostStateV1.LISTED,
        });
        this.props.dispatch(updatePost(postV1));
        this.props.dispatch(getPosts(PostStateV1.LISTED));
        routeToPosts(this.context.router, PostStateV1.LISTED);
    }

    getProgressMessage() {
        if (this.state.saving) {
            return t('(Saving...)');
        } else if (this.props.post) {
            return t('(Saved)');
        }
    }

    canEdit() {
        const {
            params,
            // post,
        } = this.props;

        // Post is being edited
        if (params && params.postId) {
            // TODO: Enable this after the backend is fixed for update post
            // calls. Without that this is a security hole.
            // Check if post has been fetched
            // if (post && post.permissions && post.permissions.can_edit) {
            //     return true;
            // }
            return true;
        } else {
            // New post is being created.
            return true;
        }

        return false;
    }

    renderHeaderActionsContainer() {
        if (this.canEdit()) {
            return (
                <div className="row middle-xs between-xs" is="headerActionContainer">
                    <div is="headerMessageText">
                        <span>Draft {this.getProgressMessage()}</span>
                    </div>
                    <div>
                        <RoundedButton
                            label={t('Publish')}
                            onTouchTap={::this.onPublishButtonTapped}
                        />
                    </div>
                </div>
            );
        }
    }

    renderPost() {
        const {
            largerDevice,
            params,
            post,
        } = this.props;

        if (params && params.postId && !post) {
            return <CenterLoadingIndicator />;
        }

        return (
            <Post
                isEditable={this.canEdit()}
                largerDevice={largerDevice}
                onSaveCallback={::this.onSavePost}
                post={post}
            />
        );
    }

    render() {
        const {
            authenticatedProfile,
        } = this.props;

        return (
            <Container>
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

export default PostEditor;

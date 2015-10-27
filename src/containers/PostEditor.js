import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { createPost, updatePost } from '../actions/posts';
import logger from '../utils/logger';
import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { routeToPosts } from '../utils/routes';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import Post from '../components/Post';
import Header from '../components/Header';
import RoundedButton from '../components/RoundedButton';

const { PostV1, PostStateV1 } = services.post.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.postSelector,
        selectors.responsiveSelector
    ],
    (authenticationState, postState, responsiveState) => {
        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            post: postState.get('draftPost'),
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
        resetScroll();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.post) {
            this.postCreationInProgress = false;
            this.setState({saving: false});
        }
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
        routeToPosts(this.context.router, PostStateV1.LISTED);
    }

    getProgressMessage() {
        if (this.state.saving) {
            return t('(Saving...)');
        } else if (this.props.post) {
            return t('(Saved)');
        }
    }

    renderHeaderActionsContainer() {
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

    render() {
        const {
            authenticatedProfile,
            largerDevice,
            post,
        } = this.props;

        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                <Post
                    isEditable={true}
                    largerDevice={largerDevice}
                    onSaveCallback={::this.onSavePost}
                    post={post}
                />
            </Container>
        );
    }
}

export default PostEditor;

import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import logger from '../utils/logger';
import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { createPost, updatePost } from '../actions/posts';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import { default as EditorComponent } from '../components/Editor';
import Header from '../components/Header';

const { PostV1, PostStateV1 } = services.post.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.postsSelector,
        selectors.responsiveSelector
    ],
    (authenticationState, postsState, responsiveState) => {
        console.log('State');
        console.log(postsState.get('draftPost'));
        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            post: postsState.get('draftPost'),
            organization: authenticationState.get('organization'),
        }
    }
);

@connect(selector)
class Editor extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
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
                state: PostStateV1.DRAFT,
            });

            this.props.dispatch(createPost(postV1));
        }
        else {
            logger.log('SAVING EXISTING POST');
            let postV1 = Object.assign({}, this.props.post, {
                content: body,
                title: title,
                state: PostStateV1.DRAFT,
            });
            this.props.dispatch(updatePost(postV1));
        }
    }

    onPublishButtonTapped() {

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
                    <FlatButton
                        is="headerActionButton"
                        label={t('Publish')}
                        labelStyle={this.styles().headerActionButtonLabel}
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
        } = this.props;

        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                <EditorComponent
                    largerDevice={largerDevice}
                    onSaveCallback={::this.onSavePost}
                />
            </Container>
        );
    }
}

export default Editor;

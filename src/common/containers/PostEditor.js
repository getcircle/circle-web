import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { clearPosts, createPost, getPost, updatePost } from '../actions/posts';
import { canvasColor, tintColor } from '../constants/styles';
import CurrentTheme from '../utils/ThemeManager';
import { deleteFile, uploadFile, clearFileUploads } from '../actions/files';
import { getPostStateURLString } from '../utils/post';
import logger from '../utils/logger';
import { POST_SOURCE } from '../constants/trackerProperties';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { routeToPost, routeToPosts } from '../utils/routes';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';
import tracker from '../utils/tracker';
import { trimNewLinesAndWhitespace } from '../utils/string';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import InternalPropTypes from '../components/InternalPropTypes';
import Post from '../components/Post';
import Header from '../components/Header';
import RoundedButton from '../components/RoundedButton';

const { PostV1, PostStateV1 } = services.post.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.filesSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
    ],
    (cacheState, filesState, postState, paramsState) => {

        let post;
        let postId = null;
        const cache = cacheState.toJS();

        // We get here either when editing a post or when creating a new one.
        if (paramsState && paramsState.postId) {
            postId = paramsState.postId;
            if (postState.get('ids').has(postId)) {
                post = retrievePost(postId, cache, ['permissions']);
            }
        } else {
            post = postState.get('draftPost');
        }

        return {
            isSaving: postState.get('loading'),
            post: post,
            shouldAutoSave: !post || (post && (!post.state || post.state === PostStateV1.DRAFT)),
            uploadProgress: filesState.get('filesProgress'),
            uploadedFiles: filesState.get('files'),
            uploadingFiles: filesState.get('loading'),
        }
    }
);

function fetchPost(dispatch, params) {
    return dispatch(getPost(params.postId));
}

function fetchData(getState, dispatch, location, params) {
    const promises = [];
    if (params && params.postId) {
        promises.push(fetchPost(dispatch, params));
    }
    return Promise.all(promises);
}

class PostEditor extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isSaving: PropTypes.bool,
        params: PropTypes.shape({
            postId: PropTypes.string,
        }),
        post: InternalPropTypes.PostV1,
        shouldAutoSave: PropTypes.bool,
        uploadProgress: PropTypes.object,
        uploadedFiles: PropTypes.object,
        uploadingFiles: PropTypes.bool,
    }

    static defaultProps = {
        shouldAutoSave: true,
        post: null,
        uploadingFiles: false,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
        showCTAsInHeader: PropTypes.bool,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    componentWillMount() {
        this.configure(this.props);
    }

    componentDidMount() {
        this.showProgressMessage(this.props);
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
            showCTAsInHeader: false,
        };
    }

    componentWillUnmount() {
        this.props.dispatch(clearFileUploads());
    }

    componentWillReceiveProps(nextProps) {
        // If this is in edit mode, load another post if we detect a different post ID in the URL
        if (this.props.params.postId && nextProps.params.postId) {
            if (nextProps.params.postId !== this.props.params.postId) {
                fetchPost(this.props.dispatch, this.props.params);
                resetScroll();
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
                        overflowX: 'hidden',
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
                    marginRight: '15px',
                    width: '90px',
                },
                },
            },
        }
    }

    postCreationInProgress = false

    configure(props) {
        resetScroll();
        this.customizeTheme();
    }

    customizeTheme() {
        let customTheme = JSON.parse(JSON.stringify(CurrentTheme));
        customTheme.flatButton.color = canvasColor;
        this.setState({muiTheme: customTheme});
    }

    loadPost(props) {
        if (props.params && props.params.postId) {
           this.props.dispatch(getPost(props.params.postId));
        }
    }

    onSavePost(title, body, fileIds, postState, postOwner) {
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
                /*eslint-disable camelcase*/
                content: trimmedBodyValue,
                file_ids: fileIds,
                title: trimmedTitleValue,
                /*eslint-enable camelcase*/
            });

            dispatch(createPost(postV1));
            dispatch(clearPosts(PostStateURLString.DRAFT));
        }
        else {
            logger.log('Saving existing post');
            let updates = {
                /*eslint-disable camelcase*/
                content: trimmedBodyValue,
                file_ids: fileIds,
                title: trimmedTitleValue,
                /*eslint-enable camelcase*/
            };

            if (postState !== undefined && postState !== null) {
                updates.state = postState;
            }

            if (postOwner !== undefined && postOwner !== null) {
                /*eslint-disable camelcase*/
                updates.by_profile_id = postOwner.id
                /*eslint-enable camelcase*/
            }

            let postV1 = Object.assign({}, post, updates);
            dispatch(updatePost(postV1));
            dispatch(clearPosts(getPostStateURLString(postV1.state)));
        }
    }

    onFileUpload(file) {
        this.props.dispatch(uploadFile(file.name, file.type, file));
    }

    onFileDelete(file) {
        this.props.dispatch(deleteFile(file));
    }

    onPublishButtonTapped() {
        // TODO: Send error message back
        if (!this.props.post) {
            return;
        }

        const { params, post } = this.props;
        const owner = this.refs.post.getCurrentOwner();

        // Track publish action
        tracker.trackPostPublished(
            post.id,
            post.state,
            !(params && params.postId),
            post.file_ids.length,
            POST_SOURCE.WEB_APP,
            owner && this.context.auth.profile.id !== owner.id
        );

        this.onSavePost(
            this.refs.post.getCurrentTitle(),
            this.refs.post.getCurrentBody(),
            this.refs.post.getCurrentFileIds(),
            PostStateV1.LISTED,
            this.refs.post.getCurrentOwner(),
        );
        this.props.dispatch(clearPosts());
        routeToPost(this.context.history, post);
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
            params,
            post,
            shouldAutoSave,
        } = props;

        let postType = '';
        if (!params || !params.postId) {
            postType = t('Draft');
        }

        if (shouldAutoSave && isSaving) {
            postType += ` ${t('Saving')}\u2026`;
        } else if ((!params || !params.postId) && post) {
            postType += ` ${t('Saved')}`;
        }

        if (this.refs.headerMessageText) {
            this.refs.headerMessageText.value = postType;
        }
    }

    renderPublishButton() {
        if (this.canEdit()) {
            return (
                <div>
                    <input disabled={true} ref="headerMessageText" style={this.styles().headerMessageText} />
                    <RoundedButton
                        disabled={this.props.uploadingFiles && !this.props.post}
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
                <div className="row middle-xs between-xs" style={this.styles().headerActionContainer}>
                    <div>
                    </div>
                    {this.renderPublishButton()}
                </div>
            );
        }
    }

    renderPost() {
        const {
            isSaving,
            params,
            post,
            shouldAutoSave,
            uploadProgress,
            uploadedFiles,
            uploadingFiles,
        } = this.props;

        if (params && params.postId && !post) {
            return <CenterLoadingIndicator />;
        }

        return (
            <Post
                autoSave={shouldAutoSave}
                isEditable={this.canEdit()}
                onFileDeleteCallback={::this.onFileDelete}
                onFileUploadCallback={::this.onFileUpload}
                onSaveCallback={::this.onSavePost}
                post={post}
                ref="post"
                saveInProgress={isSaving}
                uploadProgress={uploadProgress}
                uploadedFiles={uploadedFiles}
                uploadingFiles={uploadingFiles}
                {...this.styles().Post}
            />
        );
    }

    render() {
        return (
            <Container {...this.styles().Container}>
                <Header actionsContainer={this.renderHeaderActionsContainer()} {...this.props} />
                {this.renderPost()}
            </Container>
        );
    }
}

// Exporting the Redux store connected and the pure component separately allows
// us to test the component individually rather than relying on the store
// passing down the state.
export { PostEditor };
export default connectData(fetchData)(connect(selector)(PostEditor));

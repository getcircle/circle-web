import { Dialog, FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { clearPosts, createPost, getPost, updatePost } from '../actions/posts';
import { canvasColor, tintColor, fontColors } from '../constants/styles';
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
        confirmDiscardChanges: false,
        discardChanges: false,
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
                discardChangesDialog: {
                    ...fontColors.dark,
                    fontSize: 14,
                },
                header: {
                    backgroundColor: canvasColor,
                    padding: '10px',
                    position: 'fixed',
                    width: '100%',
                    zIndex: '10',
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
                ModalPrimaryActionButton: {
                    labelStyle: {
                        color: 'rgba(255, 0, 0, 0.7)',
                    },
                },
                MyKnowledgeButton: {
                    labelStyle: {
                        color: tintColor,
                        fontSize: 15,
                        padding: 0,
                        textTransform: 'none',
                    },
                },
                Post: {
                    style: {
                        paddingTop: '60px',
                    },
                },
                PublishButton: {
                    labelStyle: {
                        color: 'rgb(255, 255, 255)',
                    },
                    style: {
                        backgroundColor: tintColor,
                    },
                }
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

    goToMyKnowledge() {
        const isDraftPost = this.isDraftPost();
        const postState = isDraftPost ? PostStateURLString.DRAFT : PostStateURLString.LISTED;
        if (!isDraftPost && this.hasChanges() && !this.state.discardChanges) {
            // Not a draft post, has changes, and user hasn't confirmed if we should discard changes
            this.setState({
                confirmDiscardChanges: true,
            });
            return;
        }

        this.setState({
            discardChanges: false,
        });
        routeToPosts(this.context.history, postState);
    }

    isDraftPost() {
        const {
            post,
        } = this.props;

        if (post === null || (post && (!post.state || post.state === PostStateV1.DRAFT))) {
            return true;
        }

        return false;
    }

    hasChanges() {
        const {
            post,
        } = this.props;

        if (!post) {
            return false;
        }

        if (post.title !== this.refs.post.getCurrentTitle() || post.content !== this.refs.post.getCurrentBody()) {
            return true;
        }

        return false;
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

    onModalDiscardChangesTapped() {
        this.setState({
            discardChanges: true,
        }, () => {
            this.goToMyKnowledge();
        });
    }

    onModalCancelTapped() {
        this.resetDiscardChangesState();
    }

    resetDiscardChangesState() {
        this.setState({
            confirmDiscardChanges: false,
        });
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
                        {...this.styles().PublishButton}
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
                        <FlatButton
                            key="my-knowledge-button"
                            label={`< ${t('My Knowledge')}`}
                            onTouchTap={::this.goToMyKnowledge}
                            {...this.styles().MyKnowledgeButton}
                        />
                    </div>
                    {this.renderPublishButton()}
                </div>
            );
        }
    }

    renderDiscardChangesConfirmationDialog() {
        if (this.state.confirmDiscardChanges) {
            const dialogActions = [
                (<FlatButton
                    key="cancel"
                    label={t('Cancel')}
                    onTouchTap={::this.onModalCancelTapped}
                    secondary={true}
                />),
                (<FlatButton
                    key="discard"
                    label={t('Discard Changes')}
                    onTouchTap={::this.onModalDiscardChangesTapped}
                    primary={true}
                    {...this.styles().ModalPrimaryActionButton}
                />)
            ];
            return (
                <Dialog
                    actions={dialogActions}
                    bodyStyle={this.styles().discardChangesDialog}
                    defaultOpen={true}
                    open={true}
                    title={t('Discard Changes?')}
                >
                    {t('Unpublished changes will be lost.')}
                </Dialog>
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
                <header className="row" style={this.styles().header}>
                    {this.renderHeaderActionsContainer()}
                </header>
                {this.renderPost()}
                {this.renderDiscardChangesConfirmationDialog()}
            </Container>
        );
    }
}

// Exporting the Redux store connected and the pure component separately allows
// us to test the component individually rather than relying on the store
// passing down the state.
export { PostEditor };
export default connectData(fetchData)(connect(selector)(PostEditor));

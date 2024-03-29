import { Dialog, FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { provideHooks } from 'redial';

import { clearPosts, createPost, getPost, updatePost } from '../actions/posts';
import { canvasColor, tintColor, fontColors } from '../constants/styles';
import { deleteFiles, uploadFile, clearFileUploads } from '../actions/files';
import { getPostStateURLString } from '../utils/post';
import logger from '../utils/logger';
import { POST_SOURCE } from '../constants/trackerProperties';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { routeToPost, routeToPosts } from '../utils/routes';
import * as selectors from '../selectors';
import tracker from '../utils/tracker';
import { trimNewLinesAndWhitespace } from '../utils/string';
import t from '../utils/gettext';

import ArrowBackIcon from '../components/ArrowBackIcon';
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
            uploadProgress: filesState.get('progress'),
            uploadedFiles: filesState.get('files'),
            uploadingFiles: filesState.get('loading'),
        }
    }
);

function fetchPost(dispatch, params) {
    return dispatch(getPost(params.postId));
}

const hooks = {
    fetch: ({ dispatch, params }) => {
        const promises = [];
        if (params && params.postId) {
            promises.push(fetchPost(dispatch, params));
        }
        return promises;
    },
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
    }

    static childContextTypes = {
        showCTAsInHeader: PropTypes.bool,
    }

    state = {
        discardChanges: false,
        showDiscardChangesModal: false,
        titleShownInHeader: false,
    }

    componentWillMount() {
        resetScroll();
        // TODO shouldn't depend on document
        document.addEventListener('scroll', (event) => this.handleScroll(event));
    }

    componentDidMount() {
        this.showProgressMessage(this.props);
    }

    getChildContext() {
        return {
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
                ArrowBackIcon: {
                    stroke: tintColor,
                    style: {
                        marginRight: '4px',
                        position: 'relative',
                        top: '4px',
                    },
                },
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

    loadPost(props) {
        if (props.params && props.params.postId) {
           this.props.dispatch(getPost(props.params.postId));
        }
    }

    onSavePost(title, body, postState, postOwner) {
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
                title: trimmedTitleValue,
                /*eslint-enable camelcase*/
            });

            dispatch(createPost(postV1));
            dispatch(clearPosts(PostStateURLString.DRAFT, this.context.auth.profile));
        }
        else {
            logger.log('Saving existing post');
            let updates = {
                /*eslint-disable camelcase*/
                content: trimmedBodyValue,
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
            dispatch(clearPosts(getPostStateURLString(postV1.state), this.context.auth.profile));
        }
    }

    onFileUpload(file) {
        this.props.dispatch(uploadFile(file.name, file.type, file));
    }

    onFileDelete(fileIds) {
        if (fileIds && fileIds.length) {
            this.props.dispatch(deleteFiles(fileIds));
        }
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
            PostStateV1.LISTED,
            this.refs.post.getCurrentOwner(),
        );
        this.props.dispatch(clearPosts(null, this.context.auth.profile));
        this.onFileDelete(this.refs.post.getDeletedFileIds())
        routeToPost(this.context.history, post);
    }

    goToMyKnowledge() {
        const isDraftPost = this.isDraftPost();
        const postState = isDraftPost ? PostStateURLString.DRAFT : PostStateURLString.LISTED;
        if (!isDraftPost && this.hasChanges() && !this.state.discardChanges) {
            // Not a draft post, has changes, and user hasn't confirmed if we should discard changes
            this.setState({
                showDiscardChangesModal: true,
            });
            return;
        }

        routeToPosts(postState);
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
        this.hideDiscardChangesModal();
    }

    handleScroll(event) {
        if (window.scrollY >= 170) {
            this.showPostTitle();
        } else {
            this.hidePostTitle();
        }
    }

    showPostTitle() {
        if (this.refs.postEditorHeaderTitle) {
            if (this.refs.postEditorHeaderTitle.style.opacity === '0' ||
                this.refs.postEditorHeaderTitle.style.opacity === ''
            ) {
                this.setState({
                    titleShownInHeader: true,
                });
            }
            this.refs.postEditorHeaderTitle.style.opacity = 1.0;
        }
    }

    hidePostTitle() {
        if (this.refs.postEditorHeaderTitle) {
            if (this.refs.postEditorHeaderTitle.style.opacity === '1') {
                this.setState({
                    titleShownInHeader: false,
                });
            }
            this.refs.postEditorHeaderTitle.style.opacity = 0.0;
        }
    }

    hideDiscardChangesModal() {
        this.setState({
            showDiscardChangesModal: false,
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
                            label={`${t('My Knowledge')}`}
                            labelPosition="after"
                            onTouchTap={::this.goToMyKnowledge}
                            {...this.styles().MyKnowledgeButton}
                        >
                            <ArrowBackIcon {...this.styles().ArrowBackIcon} />
                        </FlatButton>
                    </div>
                    <div className="row middle-xs center-xs post-editor-header-title" ref="postEditorHeaderTitle">
                        {this.refs.post ? this.refs.post.getCurrentTitle() : ''}
                    </div>
                    {this.renderPublishButton()}
                </div>
            );
        }
    }

    renderDiscardChangesConfirmationDialog() {
        if (this.state.showDiscardChangesModal) {
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
export default provideHooks(hooks)(connect(selector)(PostEditor));

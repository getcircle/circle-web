import { CircularProgress, FlatButton, IconButton, List, ListItem } from 'material-ui';
import Dropzone from 'react-dropzone';
import Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    hasHTML,
    detectCodeMarkdownAndAddMarkup,
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
    detectURLsAndAddMarkup,
} from '../utils/string';
import { fontColors, tintColor } from '../constants/styles';
import keyCodes from '../utils/keycodes';
import { mailToPostFeedback, mailtoSharePost } from '../utils/contact';
import moment from '../utils/moment';
import { CONTACT_LOCATION } from '../constants/trackerProperties';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToEditPost, routeToProfile, routeToSearch } from '../utils/routes';
import { SHARE_CONTENT_TYPE } from '../constants/trackerProperties';
import tracker from '../utils/tracker';
import { stripTags, trimNewLines } from '../utils/string';
import t from '../utils/gettext';

import AttachmentIcon from './AttachmentIcon';
import AutogrowTextarea from './AutogrowTextarea';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DeleteIcon from './DeleteIcon';
import DetailContent from './DetailContent';
import DetailViewAll from './DetailViewAll';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';
import Share from './Share';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;
const { PostStateV1 } = services.post.containers;

class Post extends CSSComponent {

    static propTypes = {
        autoSave: PropTypes.bool,
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        onFileDeleteCallback: PropTypes.func,
        onFileUploadCallback: PropTypes.func,
        onSaveCallback: PropTypes.func,
        post: InternalPropTypes.PostV1,
        saveInProgress: PropTypes.bool,
        style: PropTypes.object,
        uploadProgress: PropTypes.object,
        uploadedFiles: PropTypes.object,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        autoSave: true,
        isEditable: false,
        post: null,
        saveInProgress: false,
        uploadProgress: Immutable.Map(),
        uploadedFiles: Immutable.Map(),
    }

    state = {
        body: '',
        derivedTitle: false,
        editing: false,
        files: Immutable.OrderedMap(),
        owner: null,
        title: '',
        uploadedFiles: Immutable.Map(),
        namesOfDeletedFiles: [],
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
        // Reset editing if a new post is loaded
        if (this.props.post &&
            nextProps.post &&
            (this.props.post.id !== nextProps.post.id || this.props.post.isEditable !== nextProps.post.isEditable)
        ) {
            this.setState({editing: false});
        }
    }

    componentDidMount() {
        const hashtags = document.getElementsByClassName('hashtag');
        let i = 0;
        const ilen = hashtags.length;
        for (i = 0; i < ilen; i++) {
            hashtags[i].addEventListener('click', (event) => {
                routeToSearch(this.context.history, event.target.innerText);
            });
        }
    }

    saveTimeout = null

    classes() {
        return {
            default: {
                AttachementListItem: {
                    innerDivStyle: {
                        marginLeft: 0,
                        paddingTop: 5,
                        paddingLeft: 40,
                        paddingBottom: 5,
                    },
                    style: {
                        marginLeft: 0,
                        paddingTop: 10,
                        paddingLeft: 0,
                        paddingBottom: 10,
                    },
                },
                attachmentListItemTextStyle: {
                    color: tintColor,
                    fontSize: '14px',
                },
                attachmentListItemDisabledTextStyle: {
                    ...fontColors.light,
                    fontSize: '14px',
                    paddingTop: 5,
                    paddingLeft: 40,
                    paddingBottom: 5,
                },
                attachmentsContainer: {
                    backgroundColor: 'transparent',
                    paddingTop: '10px',
                    paddingBottom: '0',
                    transition: 'all 0.3s ease-out',
                    width: '100%',
                },
                authorContainer: {
                    padding: 0,
                },
                AutogrowTitleTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: '0',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        fontSize: '36px',
                        letterSpacing: '0.4px',
                        lineHeight: '1.5',
                        marginTop: '20px',
                        marginBottom: '16px',
                        minHeight: 49,
                        ...fontColors.dark,
                    },
                },
                AutogrowTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: 0,
                        color: 'rgba(0, 0, 0, 0.8)',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '1.9',
                        minHeight: '50px',
                    },
                },
                cardListAvatar: {
                    height: 40,
                    width: 40,
                    top: '16px',
                    left: 0,
                },
                cardList: {
                    background: 'transparent',
                },
                CardListItem: {
                    innerDivStyle: {
                        height: 72,
                        paddingLeft: 56,
                        paddingTop: 20,
                        paddingBottom: 16,
                    },
                },
                CircularProgress: {
                    style: {
                        top: '-20px',
                        left: '-30px',
                    }
                },
                contentContainer: {
                    marginTop: 0,
                    padding: 0,
                },
                dropzoneTriggerContainer: {
                    height: 250,
                    paddingTop: 20,
                    width: '100%',
                },
                Dropzone: {
                    style: {
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: 'none',
                        fontSize: 14,
                        height: '50px',
                        padding: 0,
                        outline: 'none',
                        width: '100%',
                        ...fontColors.light,
                    },
                    activeStyle: {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '-1px 1px 1px rgba(0, 0, 0, 0.2)',
                    },
                },
                EditButton: {
                    labelStyle: {
                        color: tintColor,
                        fontSize: 15,
                        textTransform: 'none',
                    },
                },
                feedbackContainer: {
                    padding: 0,
                },
                FlatButton: {
                    labelStyle: {
                        color: tintColor,
                        padding: '0 0 0 16px',
                        textTransform: 'none',
                    },
                },
                headerContainer: {
                    width: '100%',
                },
                IconButton: {
                    style: {
                        right: '-10px',
                        top: '-10px',
                    },
                },
                IconContainer: {
                    rootStyle: {
                        border: 0,
                        left: 0,
                        height: 24,
                        top: 0,
                        width: 24,
                    },
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    strokeWidth: 1,
                },
                inlineImageContainer: {
                    padding: '25px 10px',
                    width: '100%',
                },
                inlineImageInnerDiv: {
                    width: '100%',
                },
                inlineImage: {
                    height: 'auto',
                    objectFit: 'cover',
                    maxWidth: '100%',
                },
                inlineImageCaption: {
                    ...fontColors.light,
                    fontSize: 12,
                    paddingTop: 10,
                },
                lastUpdatedText: {
                    ...fontColors.light,
                    fontSize: 14,
                    margin: '10px 0 5px 0',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '400',
                    fontStyle: 'normal',
                    fontSize: '36px',
                    letterSpacing: '0.4px',
                    lineHeight: '1.5',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                section: {
                    marginTop: 5,
                },
            },
        };
    }

    /**
     * Merges editable or dynamic properties into state.
     *
     * This is primarily done to support editing.
     * All initial and updated values are captured in the state and these are read by elements for rendering.
     * This also makes the values in props a reliable restore point for cancellation.
     *
     * @param {Object} props
     * @return {Void}
     */
    mergeStateAndProps(props) {
        // Update state with props only when editing hasn't started
        // This is to ensure we do not over-write the real time state changes caused by
        // user typing their post
        if (props.post && !this.state.editing) {
            let updatedState = {
                title: props.post.title,
                body: props.post.content,
            };

            if (this.state.owner === null) {
                updatedState.owner = props.post.by_profile;
            }

            this.setState(updatedState);
        }

        // Following logic ensures we handle the files that are
        // already attached to a post.
        // This allows us to reuse code and also, make deleting files possible.
        let uploadedFiles = Immutable.Map();
        let files = this.state.files;
        if (props.uploadedFiles) {
            uploadedFiles = props.uploadedFiles;
        }

        // If new files are detected, save to post if its a Draft
        if (props.uploadedFiles &&
            this.props.uploadedFiles &&
            !props.uploadedFiles.equals(this.props.uploadedFiles)
        ) {
            this.saveData(false);
        }

        if (props.post && props.post.files) {
            uploadedFiles = uploadedFiles.asMutable();
            props.post.files.forEach((file) => {
                if (this.state.namesOfDeletedFiles.indexOf(file.name) < 0) {
                    uploadedFiles.set(file.name, file);
                }
            });

            files = this.getUpdatedFilesMap(props.post.files);
        }

        this.setState({
            files: files,
            uploadedFiles: uploadedFiles.asImmutable(),
        });
    }

    /**
     * If autoSave is true, the value passed in explicitSave is ignored.
     */
    saveData(explicitSave) {
        const {
            autoSave,
            isEditable,
            onSaveCallback,
        } = this.props;

        if (!isEditable) {
            return;
        }

        if (autoSave === true) {
            if (this.saveTimeout !== null) {
                window.clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = window.setTimeout(() => {
                onSaveCallback(this.getCurrentTitle(), this.getCurrentBody(), this.getCurrentFileIds(), null, this.getCurrentOwner());
            }, 500);
        } else if (explicitSave === true) {
            onSaveCallback(this.getCurrentTitle(), this.getCurrentBody(), this.getCurrentFileIds(), null, this.getCurrentOwner());
        }
    }

    triggerUploads(newFiles) {
        const { onFileUploadCallback } = this.props;
        if (onFileUploadCallback) {
            newFiles.forEach((file) => {
                if (!this.isFileUploaded(file.name)) {
                    onFileUploadCallback(file);
                }
            });
        }
    }

    deleteFile(file) {
        const { onFileDeleteCallback } = this.props;
        let updatedState = {};
        const existingFiles = this.state.files;
        const existingUploadedFiles = this.state.uploadedFiles;

        if (existingFiles.size > 0) {
            updatedState.files = existingFiles.delete(file.name);
        }

        if (existingUploadedFiles.size > 0) {
            updatedState.uploadedFiles = existingUploadedFiles.delete(file.name);
        }

        updatedState.namesOfDeletedFiles = this.state.namesOfDeletedFiles;
        updatedState.namesOfDeletedFiles.push(file.name);

        this.setState(updatedState, () => {
            this.saveData(false);
            if (onFileDeleteCallback) {
                onFileDeleteCallback(file);
            }
        });
    }

    isFileUploaded(fileName) {
        const { uploadedFiles } = this.state;
        if (uploadedFiles && uploadedFiles.get(fileName)) {
            return true;
        }

        return false;
    }

    // Getters

    getFileUrl(fileName) {
        if (this.isFileUploaded(fileName)) {
            const { uploadedFiles } = this.state;
            return uploadedFiles.get(fileName).source_url;
        }

        return undefined;
    }

    getFileId(fileName) {
        if (this.isFileUploaded(fileName)) {
            const { uploadedFiles } = this.state;
            return uploadedFiles.get(fileName).id;
        }

        return '';
    }

    getCurrentTitle() {
        return this.state.title;
    }

    getCurrentBody() {
        return this.state.body;
    }

    getCurrentFileIds() {
        const files = this.state.files.filter((file) => {
            return this.isFileUploaded(file.name);
        });

        let fileIds = [];
        files.forEach((file) => {
            let fileId = this.getFileId(file.name);
            if (fileId) {
                fileIds.push(fileId);
            }
        });

        return fileIds;
    }

    getCurrentOwner() {
        return this.state.owner;
    }

    getReadOnlyContent(content) {
        const containsHTML = hasHTML(content);
        let finalContent = detectHashtagsAndAddMarkup(
            detectEmailsAndAddMarkup(
                detectURLsAndAddMarkup(
                    detectCodeMarkdownAndAddMarkup(
                        content
                    )
                )
            )
        );

        finalContent = containsHTML ? finalContent : '<div>' + finalContent + '</div>';
        return {
            __html: finalContent,
        };
    }

    // Change Methods

    handleTitleKeyDown(event) {
        if (event.keyCode && event.keyCode === keyCodes.TAB && this.refs.editor) {
            this.refs.editor.focus();
            event.preventDefault();
        }
    }

    handleTitleChange(event, value) {
        this.setState({
            derivedTitle: false,
            editing: true,
            title: value,
        }, () => this.saveData(false));
    }

    handleBodyChange(event, value) {
        const newValue = value;
        let modifiedState = {
            editing: true,
            body: newValue,
        };

        if ((this.state.title.trim() === '' || this.state.derivedTitle === true)) {
            const plainTextValue = stripTags(newValue);
            modifiedState.title = trimNewLines(plainTextValue.split('.')[0].substring(0, 80));
            modifiedState.derivedTitle = true;
        }

        this.setState(modifiedState, () => this.saveData(false));
    }

    onDrop(files) {
        if (files.length > 0) {
            let namesOfNewFiles = files.map(file => file.name);
            // Filter out deleted files that we're trying to re-upload
            let namesOfDeletedFiles = this.state.namesOfDeletedFiles.filter(nameOfDeletedFile => namesOfNewFiles.indexOf(nameOfDeletedFile) < 0);
            this.setState({'files': this.getUpdatedFilesMap(files, namesOfDeletedFiles)}, () => this.triggerUploads(files));
        }
    }

    onOwnerSelected(newOwnerProfileItem) {
        this.setState({
            owner: newOwnerProfileItem.instance,
        }, () => {
            this.saveData(false);
        });
        this.refs.changeOwnerModal.dismiss();
    }

    getSuggestImprovementsLink(post) {
        return mailToPostFeedback(post, this.context.auth.profile);
    }

    getUpdatedFilesMap(files, namesOfDeletedFiles = this.state.namesOfDeletedFiles) {
        const existingFiles = this.state.files;
        let newFilesMap = Immutable.OrderedMap();
        if (existingFiles && existingFiles.size) {
            newFilesMap = existingFiles;
        }

        newFilesMap = newFilesMap.withMutations((map) => {
            files.forEach((file) => {
                if (namesOfDeletedFiles.indexOf(file.name) < 0) {
                    map.set(file.name, file);
                }
            });
        });
        return newFilesMap;
    }

    shouldAllowChangingOwner() {
        const { profile } = this.context.auth;

        const { post } = this.props;

        // Only admin users can see the change_owner button
        return profile &&
            !!profile.is_admin &&
            post &&
            post.state === PostStateV1.LISTED;
    }

    // Render Methods

    renderSuggestImprovementsButton() {
        const {
            post,
        } = this.props;

        if (post && post.by_profile_id && post.by_profile_id !== this.context.auth.profile.id) {
            return (
                <FlatButton
                    href={this.getSuggestImprovementsLink(post)}
                    label={t('Suggest Improvements')}
                    linkButton={true}
                    onTouchTap={() => {
                        tracker.trackContactTap(
                            ContactMethodTypeV1.EMAIL,
                            post.by_profile,
                            CONTACT_LOCATION.POST_FEEDBACK
                        );
                    }}
                    target="_blank"
                    {...this.styles().FlatButton}
                />
            );
        }
    }

    renderEditAndShareButton() {
        const {
            post
        } = this.props;

        let editButton = '';
        if (post && post.permissions && post.permissions.can_edit) {
            editButton = (
                <FlatButton
                    key="edit-button"
                    label={t('Edit')}
                    onTouchTap={routeToEditPost.bind(null, this.context.history, post)}
                    {...this.styles().EditButton}
                />
            );
        }

        return (
            <div>
                <div className="row middle-xs end-xs" key="header-container" style={this.styles().headerContainer}>
                    {editButton}
                    <Share
                        mailToHref={mailtoSharePost(post, this.context.auth.profile)}
                        onShareCallback={(shareMethod) => {
                            tracker.trackShareContent(
                                post.id,
                                SHARE_CONTENT_TYPE.POST,
                                shareMethod,
                            );
                        }}
                        urlShareSource='post_share_copy'
                    />
                </div>
            </div>
        );
    }

    renderReadonlyContent() {
        const {
            post
        } = this.props;

        if (!post) {
            return;
        }

        const author = post.by_profile;
        const lastUpdatedText = ` \u2013 ${t('Last updated')} ${moment(post.changed).fromNow()}`;

        let inlineImages = [];
        let postFilesWithoutImages = [];
        if (post.files && post.files.length) {
            post.files.forEach(file => {
                if (file.content_type && file.content_type.toLowerCase().indexOf('image/') !== -1) {
                    inlineImages.push(
                        <div className="row center-xs middle-xs" style={this.styles().inlineImageContainer} key={file.id}>
                            <div style={this.styles().inlineImageInnerDiv}>
                                <a href={file.source_url} target="_blank">
                                    <img alt={t('Post attached image')} src={file.source_url} style={this.styles().inlineImage}/>
                                </a>
                            </div>
                            <div style={this.styles().inlineImageCaption}>
                                {file.name}
                            </div>
                        </div>
                    );
                } else {
                    postFilesWithoutImages.push(file);
                }
            });
        }

        return (
            <span>
                {this.renderEditAndShareButton()}
                <h1 style={this.styles().postTitle}>{post.title}</h1>
                <div className="row" style={this.styles().lastUpdatedText}>{lastUpdatedText}</div>
                <div className="row between-xs middle-xs" style={this.styles().authorAndFeedbackContainer}>
                    <div className="col-xs-8" style={this.styles().authorContainer}>
                        <CardList style={this.styles().cardList}>
                            <CardListItem
                                key={author.id}
                                leftAvatar={<ProfileAvatar profile={author} style={this.styles().cardListAvatar} />}
                                onTouchTap={routeToProfile.bind(null, this.context.history, author)}
                                primaryText={author.full_name}
                                secondaryText={author.title}
                                {...this.styles().CardListItem}
                            />
                        </CardList>
                    </div>
                    <div className="col-xs-4 end-xs middle-xs" style={this.styles().feedbackContainer}>
                        {this.renderSuggestImprovementsButton()}
                    </div>
                </div>
                <div
                    className="leditor"
                    dangerouslySetInnerHTML={this.getReadOnlyContent(post.content)}
                />
                {inlineImages}
                {this.renderFiles(postFilesWithoutImages)}
            </span>
        );
    }

    renderDeleteFileButton(file) {
        if (this.props.isEditable === true) {
            return (
                <IconButton
                    onTouchTap={(e) => {
                        this.deleteFile(file);
                    }}
                    tooltip={t('Remove attachment')}
                    touch={true}
                    {...this.styles().IconButton}
                >
                    <DeleteIcon stroke="rgba(0, 0, 0, 0.2)" />
                </IconButton>
            );
        }
    }

    renderFiles(files) {
        let elements = [];
        files.forEach((file) => {
            if (this.isFileUploaded(file.name)) {
                elements.push(
                    <ListItem
                        href={this.getFileUrl(file.name)}
                        key={this.getFileId(file.name)}
                        leftIcon={<IconContainer IconClass={AttachmentIcon} stroke="#7c7b7b" {...this.styles().IconContainer} />}
                        primaryText={<span style={{...this.styles().attachmentListItemTextStyle}}>{file.name}</span>}
                        rightIconButton={this.renderDeleteFileButton(file)}
                        target="_blank"
                        {...this.styles().AttachementListItem}
                    />
                );
            } else {
                elements.push(
                    <ListItem
                        disabled={true}
                        key={file.name}
                        leftIcon={<CircularProgress mode="indeterminate" size={0.4} {...this.styles().CircularProgress} />}
                        primaryText={<span style={{...this.styles().attachmentListItemDisabledTextStyle}}>{file.name}</span>}
                        {...this.styles().AttachementListItem}
                    />
                );
            }
        });

        return (
            <List style={this.styles().attachmentsContainer}>
                {elements}
            </List>
        );
    }

    renderFilesContainer() {
        const { post } = this.props;

        // Do not show file upload until a post has been saved.
        if (!post) {
            return;
        }

        return (
            <span>
                {this.renderFiles(this.state.files)}
                <Dropzone
                    className="row"
                    multiple={true}
                    onDrop={this.onDrop.bind(this)}
                    ref="dropzone"
                    {...this.styles().Dropzone}
                >
                    <div className="row dropzone-trigger" style={this.styles().dropzoneTriggerContainer}>
                        <div className="row col-xs start-xs">{t('Add attachments by selecting files or dropping them here')}</div>
                    </div>
                </Dropzone>
            </span>
        );
    }

    renderChangeOwnerModal() {
        if (this.shouldAllowChangingOwner()) {
            return (
                <DetailViewAll
                    filterPlaceholder={t('Search People')}
                    onSelectItem={::this.onOwnerSelected}
                    pageType={PAGE_TYPE.CHANGE_POST_OWNER}
                    ref="changeOwnerModal"
                    searchCategory={services.search.containers.search.CategoryV1.PROFILES}
                    showExpandedResults={false}
                    showRecents={false}
                    title={t('Change Owner')}
                    useDefaultClickHandlers={false}
                />
            );
        }
    }

    renderChangeOwnerButton() {
        if (this.shouldAllowChangingOwner()) {
            return (
                <FlatButton
                    label={t('Change Owner')}
                    onTouchTap={() => {
                        if (this.refs.changeOwnerModal) {
                            this.refs.changeOwnerModal.show();
                        }
                    }}
                    {...this.styles().FlatButton}
                />
            );
        }
    }

    renderRichEditableContent() {
        const {
            uploadProgress,
            uploadedFiles,
        } = this.props;

        let author = this.state.owner;
        if (author === null || author === undefined) {
            author = this.context.auth.profile;
        }

        if (!__CLIENT__) {
            return (
                <span />
            );
        }

        const Editor = require('./Editor');
        return (
            <span>
                <div className="row between-xs middle-xs">
                    <div className="col-xs-8" style={this.styles().authorContainer}>
                        <CardList style={this.styles().cardList}>
                            <CardListItem
                                disabled={true}
                                key={author.id}
                                leftAvatar={<ProfileAvatar style={this.styles().cardListAvatar} profile={author} />}
                                primaryText={author.full_name}
                                secondaryText={author.title}
                                {...this.styles().CardListItem}
                            />
                        </CardList>
                    </div>
                    <div className="col-xs-4 end-xs middle-xs" style={this.styles().feedbackContainer}>
                        {this.renderChangeOwnerButton()}
                    </div>
                </div>
                <AutogrowTextarea
                    autoFocus={true}
                    onChange={::this.handleTitleChange}
                    onKeyDown={::this.handleTitleKeyDown}
                    placeholder={t('Title')}
                    singleLine={true}
                    value={this.state.title}
                    {...this.styles().AutogrowTitleTextarea}
                />
                <Editor
                    onChange={(event) => {
                        this.handleBodyChange(event, event.target.value);
                    }}
                    onUploadCallback={(file) => {
                        this.triggerUploads([file]);
                    }}
                    placeholder={t('Contribute Knowledge')}
                    ref="editor"
                    uploadProgress={uploadProgress}
                    uploadedFiles={uploadedFiles}
                    value={this.state.body}
                />
                {this.renderFilesContainer()}
                {this.renderChangeOwnerModal()}
            </span>
        );
    }

    renderEditableContent() {
        let author = this.state.owner;
        if (author === null || author === undefined) {
            author = this.context.auth.profile;
        }

        return (
            <span>
                <div className="row between-xs middle-xs">
                    <div className="col-xs-8" style={this.styles().authorContainer}>
                        <CardList style={this.styles().cardList}>
                            <CardListItem
                                disabled={true}
                                key={author.id}
                                leftAvatar={<ProfileAvatar style={this.styles().cardListAvatar} profile={author} />}
                                primaryText={author.full_name}
                                secondaryText={author.title}
                                {...this.styles().CardListItem}
                            />
                        </CardList>
                    </div>
                    <div className="col-xs-4 end-xs middle-xs" style={this.styles().feedbackContainer}>
                        {this.renderChangeOwnerButton()}
                    </div>
                </div>
                <AutogrowTextarea
                    autoFocus={true}
                    onChange={::this.handleTitleChange}
                    placeholder={t('Title')}
                    singleLine={true}
                    value={this.state.title}
                    {...this.styles().AutogrowTitleTextarea}
                />
                <AutogrowTextarea
                    additionalHeightDelta={50}
                    onChange={::this.handleBodyChange}
                    placeholder={t('Contribute Knowledge')}
                    value={this.state.body}
                    {...this.styles().AutogrowTextarea}
                />
                {this.renderFilesContainer()}
                {this.renderChangeOwnerModal()}
            </span>
        );
    }

    renderContent() {
        const {
            isEditable,
        } = this.props;

        if (isEditable) {
            return this.renderRichEditableContent();
        } else {
            return this.renderReadonlyContent();
        }
    }

    render() {
        const {
            header,
            style,
        } = this.props;

        return (
            <DetailContent style={{...style}}>
                {header}
                <div className="row">
                    <div className="col-xs" style={this.styles().contentContainer}>
                        <div className="box">
                            {this.renderContent()}
                        </div>
                    </div>
                </div>
            </DetailContent>
        );
    }
}

export default Post;

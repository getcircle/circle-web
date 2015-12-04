import Dropzone from 'react-dropzone';
import Immutable from 'immutable';
import { CircularProgress, FlatButton, IconButton, IconMenu, List, ListItem, Snackbar } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { copyUrl } from '../utils/clipboard';
import {
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
    detectURLsAndAddMarkup,
} from '../utils/string';
import { fontColors, tintColor } from '../constants/styles';
import { mailToPostFeedback, mailtoSharePost } from '../utils/contact';
import moment from '../utils/moment';
import { CONTACT_LOCATION } from '../constants/trackerProperties';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToEditPost, routeToProfile, routeToSearch } from '../utils/routes';
import { SHARE_CONTENT_TYPE, SHARE_METHOD } from '../constants/trackerProperties';
import tracker from '../utils/tracker';
import { trimNewLines } from '../utils/string';
import t from '../utils/gettext';

import AttachmentIcon from './AttachmentIcon';
import AutogrowTextarea from './AutogrowTextarea';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DeleteIcon from './DeleteIcon';
import DetailContent from './DetailContent';
import DetailViewAll from './DetailViewAll';
import MenuGetLinkIcon from './MenuGetLinkIcon';
import IconContainer from './IconContainer';
import MenuMailIcon from './MenuMailIcon';
import ProfileAvatar from './ProfileAvatar';
import ShareIcon from './ShareIcon';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;
const { PostStateV1 } = services.post.containers;

class Post extends CSSComponent {

    static propTypes = {
        autoSave: PropTypes.bool,
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onFileDeleteCallback: PropTypes.func,
        onFileUploadCallback: PropTypes.func,
        onSaveCallback: PropTypes.func,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
        saveInProgress: PropTypes.bool,
        style: PropTypes.object,
        uploadedFiles: PropTypes.object,
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        autoSave: true,
        isEditable: false,
        post: null,
        saveInProgress: false,
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
                authorAndFeedbackContainer: {
                    marginBottom: 20,
                },
                authorContainer: {
                    padding: 0,
                },
                AutogrowTitleTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: '0',
                        fontWeight: '600',
                        fontStyle: 'normal',
                        fontSize: '30px',
                        letterSpacing: '0.4px',
                        lineHeight: '1.5',
                        marginBottom: '20px',
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
                MenuIconContainer: {
                    style: {
                        border: 0,
                        height: 24,
                        width: 24,
                        top: 6,
                        left: 20,
                    },
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    strokeWidth: 1,
                },
                MenuItem: {
                    innerDivStyle: {
                        fontSize: 14,
                        padding: '0px 16px 0px 60px',
                        textAlign: 'left',
                        ...fontColors.light,
                    },
                    style: {
                        lineHeight: '36px',
                    }
                },
                postContent: {
                    background: 'transparent',
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.9',
                    minHeight: '100vh',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    fontSize: '30px',
                    letterSpacing: '0.4px',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                ShareIconContainer: {
                    rootStyle: {
                        border: 0,
                        height: 24,
                        position: 'static',
                        width: 24,
                    },
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    strokeWidth: 1,
                },
                section: {
                    marginTop: 5,
                },
                ShareButton: {
                    style: {
                        marginLeft: 5,
                    },
                },
                Snackbar: {
                    bodyStyle: {
                        minWidth: 'inherit',
                    },
                },
            },
            'isEditable-false': {
                postTitle: {
                    margin: 0,
                },
                postContent: {
                    minHeight: 20,
                    whiteSpace: 'pre-wrap',
                },
            }
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
                uploadedFiles.set(file.name, file);
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

        this.setState(updatedState, () => {
            this.saveData(false);
        });

        if (onFileDeleteCallback) {
            onFileDeleteCallback(file);
        }
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
        return {
            __html: detectHashtagsAndAddMarkup(
                detectEmailsAndAddMarkup(
                    detectURLsAndAddMarkup(
                        content
                    )
                )
            ),
        };
    }

    // Change Methods

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

        if (this.state.title.trim() === '' || this.state.derivedTitle === true) {
            modifiedState.title = trimNewLines(newValue.split('.')[0].substring(0, 80));
            modifiedState.derivedTitle = true;
        }

        this.setState(modifiedState, () => this.saveData(false));
    }

    onDrop(files) {
        if (files.length > 0) {
            let updatedState = {};
            updatedState.files = this.getUpdatedFilesMap(files);
            this.setState(updatedState, () => this.triggerUploads(files));
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
        return mailToPostFeedback(post, this.context.authenticatedProfile);
    }

    getUpdatedFilesMap(files) {
        const existingFiles = this.state.files;
        let newFilesMap = Immutable.OrderedMap();
        if (existingFiles && existingFiles.size) {
            newFilesMap = existingFiles;
        }

        newFilesMap = newFilesMap.withMutations((map) => {
            files.forEach((file) => {
                map.set(file.name, file);
            });
        });
        return newFilesMap;
    }

    shouldAllowChangingOwner() {
        const {
            authenticatedProfile,
        } = this.context;

        const {
            post,
        } = this.props;

        // Only admin users can see the change_owner button
        return authenticatedProfile &&
            !!authenticatedProfile.is_admin &&
            post &&
            post.state === PostStateV1.LISTED;
    }

    // Render Methods

    renderSuggestImprovementsButton() {
        const {
            post,
        } = this.props;

        if (post && post.by_profile_id && post.by_profile_id !== this.context.authenticatedProfile.id) {
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

    renderShareButton() {
        return (
            <IconButton touch={true}>
                <IconContainer
                    IconClass={ShareIcon}
                    stroke={tintColor}
                    {...this.styles().ShareIconContainer}
                />
            </IconButton>
        );
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
            <div className="row middle-xs end-xs" style={this.styles().headerContainer}>
                {editButton}
                <IconMenu iconButtonElement={this.renderShareButton()} key="share">
                    <MenuItem
                        href={mailtoSharePost(post, this.context.authenticatedProfile)}
                        leftIcon={<IconContainer
                            IconClass={MenuMailIcon}
                            stroke='#757575'
                            {...this.styles().MenuIconContainer}
                        />}
                        linkButton={true}
                        onTouchTap={() => {
                            tracker.trackShareContent(
                                post.id,
                                SHARE_CONTENT_TYPE.POST,
                                SHARE_METHOD.EMAIL,
                            );
                        }}
                        primaryText={t('Share by Email')}
                        target="_blank"
                        {...this.styles().MenuItem}
                    />
                    <MenuItem
                        leftIcon={<IconContainer
                            IconClass={MenuGetLinkIcon}
                            stroke='#757575'
                            {...this.styles().MenuIconContainer}
                        />}
                        onTouchTap={() => {
                            tracker.trackShareContent(
                                post.id,
                                SHARE_CONTENT_TYPE.POST,
                                SHARE_METHOD.COPY_LINK,
                            );
                            copyUrl();
                            this.refs.snackbar.show();
                        }}
                        primaryText={t('Copy Link')}
                        {...this.styles().MenuItem}
                    />
                </IconMenu>
                <Snackbar
                    autoHideDuration={2000}
                    message={t('Link copied to clipboard!')}
                    ref='snackbar'
                    {...this.styles().Snackbar}
                />
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
                    className="postContent"
                    dangerouslySetInnerHTML={this.getReadOnlyContent(post.content)}
                    style={{...this.styles().postContent}}
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
                    largerDevice={this.props.largerDevice}
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

    renderEditableContent() {
        let author = this.state.owner;
        if (author === null || author === undefined) {
            author = this.context.authenticatedProfile;
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
                    autoFocus="true"
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
            return this.renderEditableContent();
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

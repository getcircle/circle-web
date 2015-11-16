import Dropzone from 'react-dropzone';
import Immutable from 'immutable';
import { CircularProgress, FlatButton, IconButton, List, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    detectEmailsAndAddMarkup,
    detectURLsAndAddMarkup,
} from '../utils/string';
import { fontColors } from '../constants/styles';
import { mailToPostFeedback } from '../utils/contact';
import moment from '../utils/moment';
import { CONTACT_LOCATION, POST_SOURCE } from '../constants/trackerProperties';
import { routeToPost, routeToProfile } from '../utils/routes';
import { tintColor } from '../constants/styles';
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
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from './RoundedButton';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

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
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
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
        derivedTitle: false,
        editing: false,
        title: '',
        body: '',
        uploadedFiles: Immutable.Map(),
        files: Immutable.OrderedMap(),
        saveAndExit: false,
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

        // Wait for the requested changes to save and then route to a post
        if (this.state.saveAndExit && !nextProps.saveInProgress) {
            this.setState({
                saveAndExit: false,
            });

            routeToPost(this.context.router, nextProps.post);
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
                IconButton: {
                    style: {
                        right: '-10px',
                        top: '-10px',
                    },
                },
                IconContainer: {
                    style: {
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
                postContent: {
                    background: 'transparent',
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.58',
                    minHeight: '100vh',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    fontSize: '30px',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                publishButtonContainer: {
                    width: '100%',
                },
                section: {
                    marginTop: 5,
                },
                AutogrowTitleTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: '0',
                        fontWeight: '600',
                        fontStyle: 'normal',
                        fontSize: '30px',
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
                        lineHeight: '1.58',
                        minHeight: '50px',
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
                onSaveCallback(this.state.title, this.state.body, this.getCurrentFileIds());
            }, 500);
        } else if (explicitSave === true) {
            onSaveCallback(this.state.title, this.state.body, this.getCurrentFileIds());
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

    getReadOnlyContent(content) {
        return {
            __html: detectEmailsAndAddMarkup(detectURLsAndAddMarkup(content)),
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

    // Render Methods

    renderSuggestImprovementsButton() {
        const {
            post,
        } = this.props;

        if (post && post.by_profile_id && post.by_profile_id !== this.context.authenticatedProfile.id) {
            return (
                <FlatButton
                    href={this.getSuggestImprovementsLink(post)}
                    is="FlatButton"
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
                />
            );
        }
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
                        <div className="row center-xs middle-xs" is="inlineImageContainer">
                            <div is="inlineImageInnerDiv">
                                <a href={file.source_url} target="_blank">
                                    <img alt={t('Post attached image')} is="inlineImage" src={file.source_url} />
                                </a>
                            </div>
                            <div is="inlineImageCaption">
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
                <h1 is="postTitle">{post.title}</h1>
                <div className="row" is="lastUpdatedText">{lastUpdatedText}</div>
                <div className="row between-xs middle-xs" is="authorAndFeedbackContainer">
                    <div className="col-xs-8" is="authorContainer">
                        <CardList is="cardList">
                            <CardListItem
                                is="CardListItem"
                                key={author.id}
                                leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                                onTouchTap={routeToProfile.bind(null, this.context.router, author)}
                                primaryText={author.full_name}
                                secondaryText={author.title}
                            />
                        </CardList>
                    </div>
                    <div className="col-xs-4 end-xs middle-xs" is="feedbackContainer">
                        {this.renderSuggestImprovementsButton()}
                    </div>
                </div>
                <div
                    className="postContent"
                    dangerouslySetInnerHTML={this.getReadOnlyContent(post.content)}
                    is="postContent"
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
                    is="IconButton"
                    onTouchTap={(e) => {
                        this.deleteFile(file);
                    }}
                    tooltip={t('Remove attachment')}
                    touch={true}
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
                        is="AttachementListItem"
                        key={this.getFileId(file.name)}
                        leftIcon={<IconContainer IconClass={AttachmentIcon} is="IconContainer" stroke="#7c7b7b" />}
                        primaryText={file.name}
                        primaryTextStyle={{...this.styles().attachmentListItemTextStyle}}
                        rightIconButton={this.renderDeleteFileButton(file)}
                        target="_blank"
                    />
                );
            } else {
                elements.push(
                    <ListItem
                        disabled={true}
                        is="AttachementListItem"
                        key={file.name}
                        leftIcon={<CircularProgress is="CircularProgress" mode="indeterminate" size="0.4" />}
                        primaryText={file.name}
                        primaryTextStyle={{...this.styles().attachmentListItemDisabledTextStyle}}
                    />
                );
            }
        });

        return (
            <List is="attachmentsContainer">
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
                    is="Dropzone"
                    multiple={true}
                    onDrop={this.onDrop.bind(this)}
                    ref="dropzone"
                >
                    <div className="row dropzone-trigger" is="dropzoneTriggerContainer">
                        <div className="row col-xs start-xs">{t('Add attachments by selecting files or dropping them here')}</div>
                    </div>
                </Dropzone>
            </span>
        );
    }

    renderEditableContent() {
        const {
            post,
        } = this.props;

        let author = post && post.by_profile ? post.by_profile : this.context.authenticatedProfile;
        return (
            <span>
                <div className="row col-xs" is="authorContainer">
                    <CardList is="cardList">
                        <CardListItem
                            is="CardListItem"
                            key={author.id}
                            leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                            primaryText={author.full_name}
                            secondaryText={author.title}
                        />
                    </CardList>
                </div>
                <AutogrowTextarea
                    autoFocus="true"
                    is="AutogrowTitleTextarea"
                    onChange={::this.handleTitleChange}
                    placeholder={t('Title')}
                    singleLine={true}
                    value={this.state.title}
                />
                <AutogrowTextarea
                    additionalHeightDelta={50}
                    is="AutogrowTextarea"
                    onChange={::this.handleBodyChange}
                    placeholder={t('Contribute Knowledge')}
                    value={this.state.body}
                />
                {this.renderFilesContainer()}
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

    renderActionButtons() {
        const {
            autoSave,
            header,
            isEditable,
            post,
        } = this.props;

        // If auto-save is false but the content is editable
        // show explicit controls.
        if (autoSave === false && isEditable === true && !header && post) {
            return (
                <div className="row end-xs" is="publishButtonContainer">
                    <RoundedButton
                        label={t('Publish')}
                        onTouchTap={() => {
                            this.saveData(true);
                            this.setState({
                                saveAndExit: true
                            });

                            // Track publish action
                            tracker.trackPostPublished(
                                post.id,
                                post.state,
                                false,
                                this.state.files.length,
                                POST_SOURCE.WEB_APP,
                            );

                        }}
                        ref="publishButton"
                    />
                </div>
            );
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
                {this.renderActionButtons()}
                <div className="row">
                    <div className="col-xs" is="contentContainer">
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

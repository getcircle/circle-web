import Dropzone from 'react-dropzone';
import Immutable from 'immutable';
import { CircularProgress, List, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    detectEmailsAndAddMarkup,
    detectURLsAndAddMarkup,
} from '../utils/string';
import { fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { routeToPost, routeToProfile } from '../utils/routes';
import { tintColor } from '../constants/styles';
import { trimNewLines } from '../utils/string';
import t from '../utils/gettext';

import AttachmentIcon from './AttachmentIcon';
import AutogrowTextarea from './AutogrowTextarea';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from './RoundedButton';

class Post extends CSSComponent {

    static propTypes = {
        autoSave: PropTypes.bool,
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onFileUploadCallback: PropTypes.func,
        onSaveCallback: PropTypes.func,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
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
    }

    state = {
        derivedTitle: false,
        editing: false,
        title: '',
        body: '',
        files: Immutable.OrderedSet(),
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
        // Reset editing if a new post is loaded
        if (this.props.post && nextProps.post && this.props.post.id !== nextProps.post.id) {
            this.setState({editing: false});
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
                    paddingTop: '10px',
                    paddingBottom: '0',
                    transition: 'all 0.3s ease-out',
                    width: '100%',
                },
                cardListAvatar: {
                    height: 40,
                    width: 40,
                    top: '16px',
                    left: 0,
                },
                cardList: {
                    background: 'transparent',
                    marginBottom: 20,
                },
                cardListItemInnerDivStyle: {
                    height: 72,
                    paddingLeft: 56,
                    paddingTop: 20,
                    paddingBottom: 16,
                },
                CircularProgress: {
                    style: {
                        top: '-20px',
                        left: '-30px',
                    }
                },
                contentContainer: {
                    marginTop: '20px',
                    marginLeft: '16px',
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
                lastUpdatedText: {
                    fontSize: 14,
                    margin: '10px 0 5px 0',
                    width: '100%',
                    ...fontColors.light,
                },
                postContent: {
                    background: 'transparent',
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '21px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.58',
                    minHeight: '100vh',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '400',
                    fontStyle: 'normal',
                    fontSize: '36px',
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
                        fontWeight: '400',
                        fontStyle: 'normal',
                        fontSize: '36px',
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
                        fontSize: '21px',
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
    }

    /**
     * If autoSave is true, the value passed in explicitSave is ignored.
     */
    saveData(explicitSave) {
        if (this.props.autoSave === true) {
            if (this.saveTimeout !== null) {
                window.clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = window.setTimeout(() => {
                this.props.onSaveCallback(this.state.title, this.state.body, this.getCurrentFileIds());
            }, 500);
        } else if (explicitSave === true) {
            this.props.onSaveCallback(this.state.title, this.state.body, this.getCurrentFileIds());
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

    isFileUploaded(fileName) {
        const { uploadedFiles } = this.props;
        return !!uploadedFiles.get(fileName);
    }

    // Getters

    getFileUrl(fileName) {
        if (this.isFileUploaded(fileName)) {
            const { uploadedFiles } = this.props;
            return uploadedFiles.get(fileName).source_url;
        }

        return undefined;
    }

    getFileId(fileName) {
        if (this.isFileUploaded(fileName)) {
            const { uploadedFiles } = this.props;
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
        let updatedState = {};
        const existingFiles = this.state.files;
        const newFilesSet = existingFiles.length ? existingFiles.union(files) : Immutable.OrderedSet(files);
        updatedState.files = newFilesSet;
        if (files.length > 0) {
           this.setState(updatedState, () => this.triggerUploads(files));
        }
    }

    // Render Methods

    renderReadonlyContent() {
        const {
            post
        } = this.props;

        if (!post) {
            return;
        }

        const author = post.by_profile;
        const lastUpdatedText = ` \u2013 ${t('Last updated')} ${moment(post.changed).fromNow()}`;
        return (
            <span>
                <h1 is="postTitle">{post.title}</h1>
                <div className="row" is="lastUpdatedText">{lastUpdatedText}</div>
                <CardList is="cardList">
                    <CardListItem
                        innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                        leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                        onTouchTap={routeToProfile.bind(null, this.context.router, author)}
                        primaryText={author.full_name}
                        secondaryText={author.title}
                    />
                </CardList>
                <div
                    className="postContent"
                    dangerouslySetInnerHTML={this.getReadOnlyContent(post.content)}
                    is="postContent"
                />
            </span>
        );
    }

    renderFiles(files) {
        let elements = [];
        files.forEach((file) => {
            if (this.isFileUploaded(file.name)) {
                elements.push(
                    <ListItem
                        href={this.getFileUrl(file.name)}
                        is="AttachementListItem"
                        leftIcon={<IconContainer IconClass={AttachmentIcon} is="IconContainer" stroke="#7c7b7b" />}
                        primaryText={file.name}
                        primaryTextStyle={{...this.styles().attachmentListItemTextStyle}}
                        target="_blank"
                    />
                );
            } else {
                elements.push(
                    <ListItem
                        disabled={true}
                        is="AttachementListItem"
                        leftIcon={<CircularProgress is="CircularProgress" mode="indeterminate" size="0.4" />}
                        primaryText={file.name}
                        primaryTextStyle={{...this.styles().attachmentListItemDisabledTextStyle}}
                    />
                );
            }
        });
        return elements;
    }

    renderFilesContainer() {
        const { post } = this.props;

        // Do not show file upload until a post has been saved.
        if (!post) {
            return;
        }

        return (
            <span>
                <List
                    is="attachmentsContainer"
                >
                    {this.renderFiles(this.state.files)}
                </List>
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
        return (
            <span>
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
                            routeToPost(this.context.router, post);
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
                    <div className="col-xs">
                        <div className="box" is="contentContainer">
                            {this.renderContent()}
                        </div>
                    </div>
                </div>
            </DetailContent>
        );
    }
}

export default Post;

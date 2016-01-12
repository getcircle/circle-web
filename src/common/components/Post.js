import { Dialog, FlatButton, IconButton } from 'material-ui';
import flow from 'lodash/function/flow';
import Immutable from 'immutable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    detectCodeMarkdownAndAddMarkup,
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
    detectLineBreaksAndAddMarkup,
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
import { trimNewLines } from '../utils/string';
import t from '../utils/gettext';

import AutogrowTextarea from './AutogrowTextarea';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailViewAll from './DetailViewAll';
import InternalPropTypes from './InternalPropTypes';
import MoreHorizontalIcon from './MoreHorizontalIcon';
import ProfileAvatar from './ProfileAvatar';
import Share from './Share';
import TrashIcon from './TrashIcon';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;
const { PostStateV1 } = services.post.containers;

class Post extends CSSComponent {

    static propTypes = {
        autoSave: PropTypes.bool,
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        onDeletePostCallback: PropTypes.func,
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
        openMoreActionsMenu: false,
        owner: null,
        title: '',
        showConfirmDeleteModal: false,
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
                authorContainer: {
                    padding: 0,
                },
                AutogrowTitleTextarea: {
                    style: {
                        background: '#fff',
                        marginTop: '10px',
                        padding: '16px',
                    },
                    textareaStyle: {
                        background: 'transparent',
                        border: '0',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        fontSize: '36px',
                        letterSpacing: '0.4px',
                        lineHeight: '1.5',
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
                contentContainer: {
                    marginTop: 0,
                    padding: 0,
                },
                deleteDialog: {
                    ...fontColors.dark,
                    fontSize: 14,
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
                lastUpdatedText: {
                    ...fontColors.light,
                    fontSize: 14,
                    margin: '10px 0 5px 0',
                    width: '100%',
                },
                ModalPrimaryActionButton: {
                    labelStyle: {
                        color: 'rgba(255, 0, 0, 0.7)',
                    },
                },
                MoreActionsMenuItem: {
                    innerDivStyle: {
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 14,
                        width: '128px',
                    },
                    style: {
                        lineHeight: '30px',
                        width: '128px',
                    },
                },
                moreHorizontalIcon: {
                    position: 'relative',
                    top: '-4px',
                },
                MoreIconButton: {
                    style: {
                        border: '1px solid #7A8EFF',
                        borderRadius: '2px',
                        height: '40px',
                        marginLeft: '16px',
                    },
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
                onSaveCallback(this.getCurrentTitle(), this.getCurrentBody(), null, this.getCurrentOwner());
            }, 500);
        } else if (explicitSave === true) {
            onSaveCallback(this.getCurrentTitle(), this.getCurrentBody(), null, this.getCurrentOwner());
        }
    }

    triggerUploads(newFiles) {
        const { onFileUploadCallback } = this.props;
        if (onFileUploadCallback) {
            newFiles.forEach((file) => {
                onFileUploadCallback(file);
            });
        }
    }

    hideMenu() {
        this.setState({
            openMoreActionsMenu: false,
        });
    }

    onDeleteButtonTapped(post) {
        this.setState({
            showConfirmDeleteModal: true,
        });
    }

    onModalCancelTapped() {
        this.hideConfirmDeleteModal();
    }

    onModalDeleteTapped() {
        const {
            onDeletePostCallback,
            post
        } = this.props;

        if (post && onDeletePostCallback) {
            onDeletePostCallback(post);
            tracker.trackPostRemoved(
                post.id,
                post.state
            );
        }

        this.hideConfirmDeleteModal();
    }

    hideConfirmDeleteModal() {
        this.setState({
            showConfirmDeleteModal: false,
        });
    }

    // Getters

    getCurrentTitle() {
        return this.state.title;
    }

    getCurrentBody() {
        return this.state.body;
    }

    getCurrentOwner() {
        return this.state.owner;
    }

    getReadOnlyContent(content) {
        const detectPatternsAndAddMarkup = flow(
            detectLineBreaksAndAddMarkup,
            detectCodeMarkdownAndAddMarkup,
            detectURLsAndAddMarkup,
            detectEmailsAndAddMarkup,
            detectHashtagsAndAddMarkup
        );
        const finalContent = detectPatternsAndAddMarkup(content);
        return (
            <div
                className="luno-editor"
                dangerouslySetInnerHTML={{__html: finalContent}}
            />
        );
    }

    // Change Methods

    handleTitleKeyDown(event) {
        const triggerKeyCodes = [keyCodes.TAB, keyCodes.ENTER];
        if (event.keyCode && triggerKeyCodes.indexOf(event.keyCode) !== -1 && this.refs.editor) {
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
        let modifiedState = {
            editing: true,
            body: value,
        };

        if ((this.state.title.trim() === '' || this.state.derivedTitle === true)) {
            const plainTextValue = this.getPlainTextValue(value);
            modifiedState.title = trimNewLines(plainTextValue.split('.')[0].substring(0, 80));
            modifiedState.derivedTitle = true;
        }

        this.setState(modifiedState, () => this.saveData(false));
    }

    getPlainTextValue(value) {
        // Remove tags and add space separators
        // Note this is not a generic convert rich text to plain text
        // and only applies to the editor use case
        return value.replace(/<\/?[^>]+>/gi, ' ').replace(/\s+|&nbsp;/gi, ' ').trim();
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

    renderDeleteModal() {
        if (this.state.showConfirmDeleteModal) {
            const dialogActions = [
                (<FlatButton
                    key="cancel"
                    label={t('Cancel')}
                    onTouchTap={::this.onModalCancelTapped}
                    secondary={true}
                />),
                (<FlatButton
                    key="delete"
                    label={t('Delete')}
                    onTouchTap={::this.onModalDeleteTapped}
                    primary={true}
                    {...this.styles().ModalPrimaryActionButton}
                />)
            ];
            return (
                <Dialog
                    actions={dialogActions}
                    bodyStyle={this.styles().deleteDialog}
                    defaultOpen={true}
                    open={true}
                    title={t('Delete Post?')}
                >
                    {t('Please confirm you want to delete this post. This action cannot be undone.')}
                </Dialog>
            );
        }
    }

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
        let moreActionsButton = '';
        let moreActionsMenu = '';
        if (post && post.permissions && post.permissions.can_edit) {
            editButton = (
                <FlatButton
                    key="edit-button"
                    label={t('Edit')}
                    onTouchTap={routeToEditPost.bind(null, this.context.history, post)}
                    {...this.styles().EditButton}
                />
            );

            moreActionsButton = (
                <IconButton
                    iconStyle={this.styles().moreHorizontalIcon}
                    onTouchTap={(e) => {
                        this.setState({openMoreActionsMenu: !this.state.openMoreActionsMenu});
                    }}
                    touch={true}
                    {...this.styles().MoreIconButton}
                >
                    <MoreHorizontalIcon
                        stroke={tintColor}
                    />
                </IconButton>
            );

            if (this.state.openMoreActionsMenu) {
                moreActionsMenu = (
                    <div
                        className="row middle-xs end-xs full-width"
                        key="more-actions-menu"
                        style={{position: 'relative'}}
                    >
                        <Menu
                            desktop={true}
                            onEscKeyDown={::this.hideMenu}
                            onItemTouchTap={::this.hideMenu}
                            width="128px"
                        >
                            <MenuItem
                                leftIcon={<TrashIcon stroke="rgba(0, 0, 0, 0.7)" />}
                                onTouchTap={::this.onDeleteButtonTapped}
                                primaryText={t('Delete')}
                                {...this.styles().MoreActionsMenuItem} />
                        </Menu>
                    </div>
                );
            }
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
                        urlShareSource="post_share_copy"
                    />
                    {moreActionsButton}
                </div>
                {moreActionsMenu}
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
                {this.getReadOnlyContent(post.content)}
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

    renderEditor() {
        if (__CLIENT__) {
            const {
                onFileDeleteCallback,
                uploadProgress,
                uploadedFiles,
            } = this.props;

            // We add the editor related code only on the client
            // because the library we use relies on DOM to be present.
            // It uses the global window object, event listeners, query
            // selectors, and the full Node and Element objects.
            const Editor = require('./Editor');
            return (
                <Editor
                    onChange={(event, plainTextValue) => {
                        this.handleBodyChange(event, event.target.value);
                    }}
                    onFileDeleteCallback={onFileDeleteCallback}
                    onUploadCallback={(file) => {
                        this.triggerUploads([file]);
                    }}
                    placeholder={t('Contribute Knowledge')}
                    ref="editor"
                    uploadProgress={uploadProgress}
                    uploadedFiles={uploadedFiles}
                    value={this.state.body}
                />
            );
        } else {
            return this.getReadOnlyContent(this.state.body);
        }
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
                                leftAvatar={<ProfileAvatar profile={author} style={this.styles().cardListAvatar} />}
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
                {this.renderEditor()}
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
                {this.renderDeleteModal()}
            </DetailContent>
        );
    }
}

export default Post;

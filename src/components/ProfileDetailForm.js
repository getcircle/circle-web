import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { backgroundColors, fontColors, fontWeights } from '../constants/styles';
import logger from '../utils/logger';
import * as messageTypes from '../constants/messageTypes';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import tracker from '../utils/tracker';
import { uploadMedia } from '../actions/media';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import EditProfileCameraIcon from './EditProfileCameraIcon';
import IconContainer from './IconContainer';
import Toast from './Toast';
import ProfilesSelector from './ProfilesSelector'

const { MediaTypeV1 } = services.media.containers.media;
const { ContactMethodV1 } = services.profile.containers;

const mediaSelector = selectors.createImmutableSelector(
    [selectors.mediaUploadSelector], (mediaUploadState) => {
        return {
            mediaUrl: mediaUploadState.get('mediaUrl'),
        };
    }
);

@connect(mediaSelector)
class ProfileDetailForm extends CSSComponent {
    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mediaUrl: PropTypes.string,
        onSaveCallback: PropTypes.func.isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    static defaultProps = {
        mediaUrl: '',
    }

    state = {
        firstName: '',
        lastName: '',
        cellNumber: '',
        dataChanged: false,
        error: '',
        imageUrl: '',
        imageFiles: [],
        title: '',
        manager: null,
        saving: false,
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
    }

    directAttributesToStateMapping = {
        /*eslint-disable camelcase*/
        'first_name': 'firstName',
        'last_name': 'lastName',
        'image_url': 'imageUrl',
        'title': 'title',
        /*eslint-enable camelcase*/
    }

    classes() {
        return {
            'default': {
                dropzone: {
                    alignItems: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '50px',
                    justifyContent: 'flex-start',
                    padding: 0,
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                dropzoneActive: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '-1px 1px 1px rgba(0, 0, 0, 0.2)',
                },
                dropzoneTriggerContainer: {
                    alignItems: 'center',
                    display: 'flex',
                },
                editProfileCameraIconContainer: {
                    border: 0,
                    left: 0,
                    height: 50,
                    position: 'relative',
                    top: 0,
                    width: 45,
                },
                editProfileCameraIcon: {
                    height: 50,
                    width: 50,
                },
                firstField: {
                    paddingLeft: 0,
                },
                lastField: {
                    paddingRight: 0,
                },
                formContainer: {
                    backgroundColor: 'rgb(255, 255, 255)',
                    padding: 0,
                    width: '100%',
                },
                form: {
                    padding: '0 16px 16px 16px',
                },
                input: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '50px',
                    outline: 'none',
                    padding: '10px',
                    width: '100%',
                    ...fontColors.dark,
                },
                profileImage: {
                    border: '0',
                    borderRadius: 25,
                    height: 50,
                    objectFit: 'cover',
                    width: 50,
                },
                profileImageButton: {
                    backgroundColor: 'transparent',
                    border: '0',
                    marginRight: 10,
                    padding: 0,
                    outline: 'none',
                    width: 50,
                    height: 50,
                },
                profileImageUploadContainer: {
                    alignItems: 'center',
                    display: 'flex',
                },
                sectionTitle: {
                    fontSize: 11,
                    letterSpacing: '1px',
                    margin: '16px 0',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
                },
                ProfilesSelector: {
                    arrowIconContainerStyle: {
                        border: 0,
                        height: 8,
                        width: 14,
                        position: 'relative',
                        top: -25,
                        left: 'calc(100% - 32px)',
                        pointerEvents: 'none',
                    },
                    arrowIconStyle: {
                        height: 8,
                        width: 14,
                    },
                    fieldInputStyle: {
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px',
                        boxSizing: 'border-box',
                        fontSize: 14,
                        height: '50px',
                        outline: 'none',
                        padding: '10px',
                        width: '100%',
                        ...fontColors.dark,
                    },
                    listDividerStyle: {
                        backgroundColor: 'rgba(0, 0, 0, .05)',
                        marginLeft: 58,
                    },
                    listItemInnerDivStyle: {
                        textAlign: 'left',
                        paddingLeft: 70,
                    },
                    listItemPrimaryTextStyle: {
                        fontSize: 14,
                        ...fontColors.dark,
                    },
                    fieldListStyle: {
                        borderRadius: '0px 0px 3px 3px',
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                        textAlign: 'start',
                        height: 'auto',
                        width: 'calc(100% - 32px)',
                        position: 'absolute',
                        marginTop: '-9px',
                    },
                    fieldSearchIconStyle: {
                        height: 25,
                        left: 10,
                        position: 'absolute',
                        top: 12,
                        width: 25,
                    },
                    fieldSearchInputStyle: {
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px',
                        boxSizing: 'border-box',
                        fontSize: 14,
                        height: '50px',
                        outline: 'none',
                        width: '100%',
                        lineHeight: 'normal',
                        paddingTop: '10px',
                        paddingLeft: '40px',
                        paddingBottom: '10px',
                        paddingRight: '10px',
                        ...fontColors.dark,
                    },
                    dialogSearchInputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                        width: 'initial',
                        height: 50,
                        margin: 10,
                        ...backgroundColors.light,
                    },
                    dialogSearchInputStyle: {
                        border: 'none',
                        borderRadius: 4,
                        fontSize: '14px',
                        lineHeight: '19px',
                        outline: 'none',
                        paddingLeft: 5,
                        height: '100%',
                        ...fontColors.light,
                    },
                    dialogSearchIconStyle: {
                        alignSelf: 'center',
                        height: 25,
                        marginLeft: 14,
                        width: 25,
                    },
                    dialogListStyle: {
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '0px 0px 3px 3px',
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                        overflowY: 'hidden',
                        textAlign: 'start',
                        height: '100vh',
                        width: '100vw',
                    },
                },
            },
            'error': {
                textarea: {
                    borderColor: 'rgba(255, 0, 0, 0.7)',
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
        let updatedState = {
            imageUrl: this.getPreviewImageUrl(props),
        };

        if (!this.state.saving) {
            updatedState.title = props ? props.profile.title : '';
            updatedState.cellNumber = this.getCellNumberFromProps(props);
            updatedState.firstName = props ? props.profile.first_name : '';
            updatedState.lastName = props ? props.profile.last_name : '';
            updatedState.manager = props.manager;
        }

        this.setState(updatedState, () => {
            // Given our state machine, the only time mediaUrl is present is when a save is in progress.
            // Continue the save action
            if (props && props.mediaUrl !== '') {
                this.updateProfile();
            }
        });
    }

    resetState() {
        // Need to reset state before dismissing because these
        // components can be cached and carry state.
        this.setState({
            error: '',
            imageFiles: [],
            saving: false,
            dataChanged: false,
        });
        this.refs.modal.setSaveEnabled(false);
    }

    // Public Methods

    show() {
        this.refs.modal.show();
        this.mergeStateAndProps(this.props);
    }

    dismiss() {
        this.refs.modal.dismiss();
    }

    getPreviewImageUrl(props) {
        if (!props) {
            return '';
        }

        // Show preview of the existing image or the new one being uploaded
        // by the user
        return props.mediaUrl !== '' ? props.mediaUrl : props.profile.image_url;
    }

    validate() {
        const requiredFieldsToTitle = {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'title': 'Title',
        };

        for (let requiredField in requiredFieldsToTitle) {
            if (this.state[requiredField].trim() === '') {
                this.setState({
                    'error': t(requiredFieldsToTitle[requiredField] + ' cannot be empty.'),
                });
                return false;
            }
        }

        this.setState({
            'error': '',
        });
        return true;
    }

    handleChange(event) {
        let updatedState = {};
        if (this.state[event.target.name] !== undefined) {
            updatedState[event.target.name] = event.target.value;
            // Reset state on any key change
            updatedState.error = '';
        } else {
            logger.error('Received change event for untracked input.');
            return;
        }

        this.setState(updatedState, () => this.detectChangeAndEnableSaving());
    }

    detectChangeAndEnableSaving() {
        let dataChanged = this.getFieldsThatChanged().length > 0 || this.state.imageFiles.length > 0;
        this.refs.modal.setSaveEnabled(dataChanged);
        this.setState({dataChanged: dataChanged});
    }

    updateProfile() {
        let fieldsChanged = this.getFieldsThatChanged();
        if (fieldsChanged.length > 0) {
            tracker.trackProfileUpdate(
                this.props.profile.id,
                fieldsChanged
            );
        }

        this.props.onSaveCallback(this.getUpdatedProfile(), this.state.manager);
        this.resetState();
        this.dismiss();
    }

    getUpdatedProfile() {
        let contactMethods = [new ContactMethodV1({
            label: 'Cell Phone',
            value: this.state.cellNumber,
            /*eslint-disable camelcase*/
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.CELL_PHONE,
            /*eslint-enable camelcase*/
        })];

        let updatedProfile = {
            /*eslint-disable camelcase*/
            contact_methods: contactMethods,
            /*eslint-enable camelcase*/
        };
        for (let attribute in this.directAttributesToStateMapping) {
            updatedProfile[attribute] = this.state[this.directAttributesToStateMapping[attribute]];
        }
        updatedProfile = Object.assign({}, this.props.profile, updatedProfile);
        return updatedProfile;
    }

    getFieldsThatChanged() {
        let fields = [];
        let profile = this.props.profile;
        for (let attribute in this.directAttributesToStateMapping) {
            if (this.state[this.directAttributesToStateMapping[attribute]] !== profile[attribute]) {
                fields.push(attribute)
            }
        }

        if (this.state.cellNumber !== this.getCellNumberFromProps(this.props)) {
            fields.push('cell_number');
        }

        if (this.state.manager !== this.props.manager) {
            fields.push('manager');
        }

        return fields;
    }

    getCellNumberFromProps(props) {
        let cellNumber = '';
        if (props.contactMethods && props.contactMethods.length > 0) {
            for (let key in props.contactMethods) {
                let contactMethod = props.contactMethods[key];
                if (contactMethod && contactMethod.contact_method_type === ContactMethodV1.ContactMethodTypeV1.CELL_PHONE) {
                    cellNumber = contactMethod.value;
                    break;
                }
            }
        }

        return cellNumber;
    }

    handleManagerSelected(manager) {
        this.setState({manager}, () => this.detectChangeAndEnableSaving());
    }

    handleSaveTapped() {
        if (!this.validate()) {
            return;
        }

        // Disable Save button to avoid double submission
        this.refs.modal.setSaveEnabled(false);

        // If an image was added, upload it first
        if (this.state.imageFiles.length > 0 && this.props.mediaUrl === '') {
            this.props.dispatch(uploadMedia(
                this.state.imageFiles[0],
                MediaTypeV1.PROFILE,
                this.props.profile.id
            ));
            // Wait until media upload is done
            this.setState({saving: true});
        } else {
            this.updateProfile();
        }
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    onDrop(files) {
        let updatedState = {};
        updatedState.imageFiles = files;
        if (files.length > 0) {
           this.setState(updatedState, () => this.detectChangeAndEnableSaving());
        }
    }

    renderProgressIndicator() {
        if (this.state.saving) {
            return (
                <LinearProgress mode="indeterminate" />
            );
        }
    }

    renderToast() {
        if (this.state.error.trim() !== '') {
            return (
                <Toast
                    message={this.state.error}
                    messageType={messageTypes.ERROR}
                />
            );
        } else if (!!this.props.manager && this.state.dataChanged === true) {
            return (
                <Toast
                    message={t('Your manager will be notified of changes when you hit Save.')}
                    messageType={messageTypes.WARNING}
                />
            );
        }
    }

    renderContent() {
        const {
            dispatch,
            largerDevice,
        } = this.props;

        let imageUrl = this.state.imageFiles.length > 0 ? this.state.imageFiles[0].preview : this.state.imageUrl;
        let selectFieldValue = !!this.state.manager ? this.state.manager.full_name : '';

        return (
            <div className="col-xs center-xs" is="formContainer">
                {this.renderProgressIndicator()}
                {this.renderToast()}
                <form is="form">
                    <div is="sectionTitle">{t('Photo')}</div>
                    <div className="row start-xs" is="profileImageUploadContainer">
                        <button
                            className="dropzone-trigger"
                            disabled={this.state.saving}
                            is="profileImageButton"
                            onClick={this.onOpenClick.bind(this)}
                            type="button"
                        >
                            <img alt={t('Image')} is="profileImage" src={imageUrl} />
                        </button>
                        <Dropzone
                            activeStyle={{...this.styles().dropzoneActive}}
                            className="col-xs"
                            is="dropzone"
                            multiple={false}
                            onDrop={this.onDrop.bind(this)}
                            ref="dropzone"
                        >
                            <div className="row center-xs middle-xs dropzone-trigger" is="dropzoneTriggerContainer">
                                <IconContainer
                                    IconClass={EditProfileCameraIcon}
                                    iconStyle={{...this.styles().editProfileCameraIcon}}
                                    is="editProfileCameraIconContainer"
                                    stroke='rgba(0, 0, 0, 0.4)'
                                />
                                <div className="row col-xs start-xs">{t('Update Photo')}</div>
                            </div>
                        </Dropzone>
                    </div>
                    <div className="row">
                        <div className="col-xs" is="firstField">
                            <div is="sectionTitle">{t('First Name')}</div>
                            <input
                                disabled={this.state.saving}
                                is="input"
                                name="firstName"
                                onChange={this.handleChange.bind(this)}
                                placeholder={t('First Name')}
                                type="text"
                                value={this.state.firstName}
                             />
                        </div>
                        <div className="col-xs" is="lastField">
                            <div is="sectionTitle">{t('Last Name')}</div>
                            <input
                                disabled={this.state.saving}
                                is="input"
                                name="lastName"
                                onChange={this.handleChange.bind(this)}
                                placeholder={t('Last Name')}
                                type="text"
                                value={this.state.lastName}
                             />
                        </div>
                    </div>
                    <div is="sectionTitle">{t('Title')}</div>
                    <input
                        disabled={this.state.saving}
                        is="input"
                        name="title"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('Job Title')}
                        type="text"
                        value={this.state.title}
                     />
                    <div is="sectionTitle">{t('Contact')}</div>
                    <input
                        disabled={this.state.saving}
                        is="input"
                        name="cellNumber"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('Add your cell number')}
                        type="tel"
                        value={this.state.cellNumber}
                     />
                    <div is="sectionTitle">{t('Reports to')}</div>
                    <ProfilesSelector
                        dialogTitle={t('Change Manager')}
                        dispatch={dispatch}
                        is="ProfilesSelector"
                        largerDevice={largerDevice}
                        onSelect={::this.handleManagerSelected}
                        searchInputPlaceholder={t('Search Manager')}
                        value={selectFieldValue}
                    />
                </form>
            </div>
        );
    }

    render() {
        const {
            largerDevice,
            ...other
        } = this.props;

        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={t('Save')}
                    is="Dialog"
                    largerDevice={largerDevice}
                    onDismiss={this.resetState.bind(this)}
                    onSave={this.handleSaveTapped.bind(this)}
                    pageType={PAGE_TYPE.EDIT_PROFILE}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={t('Edit Profile')}
                >
                    <div className="row center-xs">
                        {this.renderContent()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default ProfileDetailForm;

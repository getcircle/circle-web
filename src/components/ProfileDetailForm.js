import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { uploadMedia } from '../actions/media';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import EditProfileCameraIcon from './EditProfileCameraIcon';
import IconContainer from './IconContainer';

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
        mediaUrl: PropTypes.string,
        onSaveCallback: PropTypes.func.isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    static defaultProps = {
        mediaUrl: '',
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
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
                errorContainer: {
                    display: 'none',
                    justifyContent: 'space-between',
                    padding: '10px 10px 10px 0',
                },
                errorMessage: {
                    color: 'rgba(255, 0, 0, 0.7)',
                    fontSize: 13,
                },
                formContainer: {
                    backgroundColor: 'rgb(255, 255, 255)',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%',
                },
                form: {
                    padding: '0 16px 16px 16px',
                },
                input: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
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
                    borderRadius: 25,
                    height: 50,
                    objectFit: 'cover',
                    width: 50,
                },
                profileImageButton: {
                    backgroundColor: 'transparent',
                    border: 0,
                    display: 'flex',
                    marginRight: 10,
                    oultine: 'none',
                    padding: 0,
                },
                profileImageUploadContainer: {
                    alignItems: 'center',
                    display: 'flex',
                },
                sectionTitle: {
                    fontSize: 11,
                    letterSpacing: '2px',
                    margin: '16px 0',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
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

        this.setState({
            imageUrl: getPreviewImageUrl(props),
            title: props ? props.profile.title : '',
            cellNumber: cellNumber,
        }, () => {
            // Given our state machine, the only time mediaUrl is present is when a save is in progress.
            // Continue the save action
            if (props && props.mediaUrl !== '') {
                this.updateProfile();
            }
        });
    }

    state = {
        imageUrl: '',
        imageFiles: [],
        phoneNumber: '',
        title: '',
        saving: false,
    }

    // Public Methods

    show() {
        this.refs.modal.show();
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

    handleChange(event) {
        let updatedState = {};

        // TODO: Make this generic
        switch (event.target.name) {
            case 'title':
                updatedState.title = event.target.value;
                break;

            case 'cellNumber':
                updatedState.cellNumber = event.target.value;
                break;

            default:
                break;
        }

        this.setState(updatedState);
    }

    updateProfile() {
        // TODO:
        // Add validation
        // Handle contact methods correctly

        const {
            profile,
            onSaveCallback,
        } = this.props;

        let contactMethods = [new ContactMethodV1({
            label: 'Cell Phone',
            value: this.state.cellNumber,
            /*eslint-disable camelcase*/
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.CELL_PHONE,
            /*eslint-enable camelcase*/
        })];

        let updatedProfile = Object.assign({}, profile, {
            /*eslint-disable camelcase*/
            contact_methods: contactMethods,
            image_url: this.state.imageUrl,
            title:  this.state.title,
            /*eslint-enable camelcase*/
        });

        onSaveCallback(updatedProfile);
        // Need to reset state before dismissing because these
        // components can be cached and carry state.
        this.refs.modal.setSaveEnabled(true);
        this.dismiss();
    }

    handleSaveTapped() {

        // Disable Save button
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
           this.setState(updatedState);
        }
    }

    renderProgressIndicator() {
        if (this.state.saving) {
            return (
                <LinearProgress mode="indeterminate" />
            );
        }
    }

    renderContent() {
        let error = '';
        let imageUrl = this.state.imageFiles.length > 0 ? this.state.imageFiles[0].preview : this.state.imageUrl;

        return (
            <div is="formContainer">
                {this.renderProgressIndicator()}
                <form is="form">
                    <div is="sectionTitle">{t('Photo')}</div>
                    <div is="profileImageUploadContainer">
                        <button
                            disabled={this.state.saving}
                            is="profileImageButton"
                            onClick={this.onOpenClick.bind(this)}
                            type="button"
                        >
                            <img alt={t('Profile Image')} is="profileImage" src={imageUrl} />
                        </button>
                        <Dropzone
                            activeStyle={{...this.styles().dropzoneActive}}
                            is="dropzone"
                            multiple={false}
                            onDrop={this.onDrop.bind(this)}
                            ref="dropzone"
                        >
                            <div is="dropzoneTriggerContainer">
                                <IconContainer
                                    IconClass={EditProfileCameraIcon}
                                    iconStyle={{...this.styles().editProfileCameraIcon}}
                                    is="EditProfileCameraIconContainer"
                                    stroke='rgba(0, 0, 0, 0.4)'
                                />
                                <div>{t('Update Photo')}</div>
                            </div>
                        </Dropzone>
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
                     <div is="errorContainer">
                        <span is="errorMessage">
                            {error}
                        </span>
                    </div>
                    <div is="sectionTitle">{t('Contact')}</div>
                    <input
                        disabled={this.state.saving}
                        is="input"
                        name="cellNumber"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('Add your cell number')}
                        type="text"
                        value={this.state.cellNumber}
                     />
                </form>
            </div>
        );
    }

    render() {
        const {
            ...other
        } = this.props;

        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={t('Save')}
                    is="Dialog"
                    onSave={this.handleSaveTapped.bind(this)}
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

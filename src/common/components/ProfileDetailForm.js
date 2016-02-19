import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { hideModal } from '../actions/profiles';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { profileValidator } from '../utils/validators';
import { PROFILE_DETAIL } from '../constants/forms';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import tracker from '../utils/tracker';
import { uploadMedia } from '../actions/media';

import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormPhotoField from './FormPhotoField';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const { MediaTypeV1 } = services.media.containers.media;
const { ContactMethodV1 } = services.profile.containers;

const fieldNames = ['bio', 'cellNumber', 'firstName', 'lastName', 'photo', 'title'];

const selector = selectors.createImmutableSelector(
    [
        selectors.mediaUploadSelector,
        selectors.updateProfileSelector,
    ],
    (
        mediaUploadState,
        updateProfileState,
    ) => {
        return {
            mediaUrl: mediaUploadState.get('mediaUrl'),
            formSubmitting: updateProfileState.get('formSubmitting'),
            visible: updateProfileState.get('modalVisible'),
        };
    }
);


export class ProfileDetailForm extends Component {
    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        dirty: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        mediaUrl: PropTypes.string,
        onSaveCallback: PropTypes.func.isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        resetForm: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    state = {
        mediaUrl: '',
    };

    componentWillMount() {
        this.setInitialValues();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.setInitialValues();
            this.props.resetForm();
        }

        if (this.props.mediaUrl  === '' && nextProps.mediaUrl) {
            /*eslint-disable camelcase*/
            this.updateProfile({image_url: nextProps.mediaUrl});
            /*eslint-enable camelcase*/
        }
    }

    directAttributesToStateMapping = {
        /*eslint-disable camelcase*/
        'first_name': 'firstName',
        'last_name': 'lastName',
        'title': 'title',
        /*eslint-enable camelcase*/
    };

    setInitialValues() {
        const { dispatch, profile } = this.props;

        const action = initialize(PROFILE_DETAIL, {
            firstName: profile.first_name,
            lastName: profile.last_name,
            photo: {existing: true, preview: profile.image_url},
            title: profile.title,
            cellNumber: this.getCellNumberFromProps(this.props),
        }, fieldNames);

        dispatch(action);
    }

    // Public Methods

    updateProfile(overrides) {
        if (this.props.dirty) {
            tracker.trackProfileUpdate(
                this.props.profile.id,
                this.getFieldsThatChanged(),
            );
        }

        this.props.onSaveCallback(this.getUpdatedProfile(overrides));
    }

    getUpdatedProfile(overrides = {}) {
        const { fields, profile } = this.props;

        let contactMethods = [new ContactMethodV1({
            label: 'Cell Phone',
            value: fields.cellNumber.value,
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
            updatedProfile[attribute] = fields[this.directAttributesToStateMapping[attribute]].value;
        }

        updatedProfile = Object.assign({}, profile, updatedProfile, overrides);
        return updatedProfile;
    }

    getFieldsThatChanged() {
        return fieldNames.filter(field => this.props.fields[field].dirty);
    }

    getCellNumberFromProps(props) {
        let cellNumber = '';
        if (props.contactMethods && props.contactMethods.length > 0) {
            for (let key in props.contactMethods) {
                let contactMethod = props.contactMethods[key];
                if (
                    contactMethod &&
                    (
                        contactMethod.contact_method_type === ContactMethodV1.ContactMethodTypeV1.CELL_PHONE ||
                        contactMethod.contact_method_type === null
                    )
                ) {
                    cellNumber = contactMethod.value;
                    break;
                }
            }
        }

        return cellNumber;
    }

    submit = (values, dispatch) => {
        const { profile } = this.props;

        if (!values.photo.existing) {
            dispatch(uploadMedia(
                values.photo,
                MediaTypeV1.PROFILE,
                profile.id
            ));
        } else {
            this.updateProfile();
        }
    }

    handleCancel = () => {
        this.props.dispatch(hideModal());
    }

    renderFields() {
        const {
            fields: {
                bio,
                cellNumber,
                firstName,
                photo,
                lastName,
                title,
            },
        } = this.props;
        const styles = {
            root: {
                marginTop: 20,
            },
            firstField: {
                paddingLeft: 0,
            },
            lastField: {
                paddingRight: 0,
            },
        };

        return (
            <div style={styles.root}>
                <FormPhotoField
                    {...photo}
                />
                <div className="row">
                    <div className="col-xs" style={styles.firstField}>
                        <FormLabel text={t('First Name')} />
                        <FormTextField
                            placeholder={t('First Name')}
                            {...firstName}
                         />
                    </div>
                    <div className="col-xs" style={styles.lastField}>
                        <FormLabel text={t('Last Name')} />
                        <FormTextField
                            placeholder={t('Last Name')}
                            {...lastName}
                         />
                    </div>
                </div>
                <FormLabel text={t('Title')} />
                <FormTextField
                    placeholder={t('Job Title')}
                    {...title}
                 />
                <FormLabel text={t('Bio')} />
                <FormTextArea
                    placeholder={t('')}
                    {...bio}
                />
                <FormLabel text={t('Contact')} />
                <FormTextField
                    placeholder={t('Add your cell number')}
                    {...cellNumber}
                 />
            </div>
        );
    }

    render() {
        const { formSubmitting, handleSubmit, visible } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.EDIT_PROFILE}
                submitLabel={t('Update')}
                submitting={formSubmitting}
                title={t('Edit Profile')}
                visible={visible}
            >
                {this.renderFields()}
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: PROFILE_DETAIL,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: profileValidator,
    },
    selector
)(ProfileDetailForm);

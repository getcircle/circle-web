import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { hideFormDialog } from '../actions/forms';
import { updateProfile } from '../actions/profiles';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { profileValidator } from '../utils/validators';
import { EDIT_PROFILE } from '../constants/forms';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import FormContactList from './FormContactList';
import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormPhotoField from './FormPhotoField';
import FormPersonSelector from './FormPersonSelector';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const { ContactMethodV1 } = services.profile.containers;

export const fieldNames = [
    'bio',
    'contacts[].type',
    'contacts[].value',
    'email',
    'firstName',
    'lastName',
    'manager',
    'photo',
    'title'
];

const selector = selectors.createImmutableSelector(
    [
        selectors.mediaUploadSelector,
        selectors.formDialogsSelector,
    ],
    (
        mediaUploadState,
        formDialogsState,
    ) => {
        const dialogState = formDialogsState.get(EDIT_PROFILE);
        return {
            mediaUrl: mediaUploadState.get('mediaUrl'),
            submitting: dialogState.get('submitting'),
            visible: dialogState.get('visible'),
        };
    }
);

export function getUpdatedProfile({ fields, profile }) {
    const contactMethods = fields.contacts.map(c => {
        return new ContactMethodV1({
            /*eslint-disable camelcase*/
            value: c.value.value,
            contact_method_type: c.type.value,
            /*eslint-enable camelcase*/
        })
    });

    // pull out fields that don't directly map to the profile protobuf
    const { contacts, firstName, lastName, manager, photo, ...protobufFields } = fields;

    let updatedProfile = {
        /*eslint-disable camelcase*/
        contact_methods: contactMethods,
        first_name: firstName.value,
        last_name: lastName.value,
        /*eslint-enable camelcase*/
    };
    for (let field in protobufFields) {
        updatedProfile[field] = protobufFields[field].value;
    }
    updatedProfile = Object.assign({}, profile, updatedProfile);
    return updatedProfile;
}

export class ProfileDetailForm extends Component {
    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        dirty: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mediaUrl: PropTypes.string,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        resetForm: PropTypes.func.isRequired,
        submitting: PropTypes.bool,
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
    }

    setInitialValues() {
        const { dispatch, manager, profile } = this.props;

        const defaultContactType = ContactMethodV1.ContactMethodTypeV1.CELL_PHONE;
        const contacts = profile.contact_methods.map(c => {
            /*eslint-disable camelcase*/
            return {type: c.contact_method_type || defaultContactType, value: c.value};
            /*eslint-enable camelcase*/
        });

        const action = initialize(EDIT_PROFILE, {
            bio: profile.bio,
            contacts,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            manager: manager,
            photo: {existing: true, preview: profile.image_url},
            title: profile.title,
        }, fieldNames);

        dispatch(action);
    }

    getFieldsThatChanged() {
        return fieldNames.filter(fieldName => {
            if (fieldName.includes('[].')) {
                const [first, second] = fieldName.split('[].');
                return this.props.fields[first].some(f => f[second].dirty);
            } else {
                return this.props.fields[fieldName].dirty;
            }
        });
    }

    submit = (values, dispatch) => {
        const { dirty, fields, profile } = this.props;
        const { manager, photo } = values;
        if (dirty) {
            tracker.trackProfileUpdate(
                profile.id,
                this.getFieldsThatChanged(),
            );
        }

        const updatedProfile = getUpdatedProfile({ fields, profile });
        const newPhoto = photo.existing ? null : photo;
        dispatch(updateProfile(updatedProfile, manager, newPhoto));
    }

    handleCancel = () => {
        this.props.dispatch(hideFormDialog(EDIT_PROFILE));
    }

    renderFields() {
        const {
            fields: {
                bio,
                contacts,
                email,
                firstName,
                manager,
                photo,
                lastName,
                title,
            },
            profile,
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
                <FormLabel text={t('Reports To')} />
                <FormPersonSelector ignoreProfileIds={[profile.id]} {...manager} />
                <FormLabel text={t('Email')} />
                <FormTextField
                    placeholder={t('Email')}
                    {...email}
                />
                <FormLabel text={t('Other Contact')} />
                <FormContactList
                    contacts={contacts}
                    defaultType={ContactMethodV1.ContactMethodTypeV1.CELL_PHONE}
                    types={ContactMethodV1.ContactMethodTypeV1}
                />
            </div>
        );
    }

    render() {
        const { submitting, handleSubmit, visible } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.EDIT_PROFILE}
                submitLabel={t('Update')}
                submitting={submitting}
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
      form: EDIT_PROFILE,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: profileValidator,
    },
    selector
)(ProfileDetailForm);

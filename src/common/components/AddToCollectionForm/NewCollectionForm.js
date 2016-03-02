import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { createCollection } from '../../actions/collections';
import { CREATE_COLLECTION } from '../../constants/forms';
import t from '../../utils/gettext';
import { collectionValidator } from '../../utils/validators';

import Form from '../Form';
import FormLabel from '../FormLabel';
import FormSelectField from '../FormSelectField';
import FormTextField from '../FormTextField';
import InternalPropTypes from '../InternalPropTypes';
import PrimaryRoundedButton from '../PrimaryRoundedButton';

const { OwnerTypeV1 } = services.post.containers.CollectionV1;

const FIELD_NAMES = ['name', 'ownerId'];

class NewCollectionForm extends Component {

    componentWillMount() {
        this.setInitialValues(this.props);
    }

    setInitialValues(props) {
        const { dispatch } = props;
        const { auth: { profile: {id: ownerId} } } = this.context;
        const action = initialize(CREATE_COLLECTION, {ownerId}, FIELD_NAMES);
        dispatch(action);
    }

    submit = (values, dispatch) => {
        const { name, ownerId } = values;
        const { auth: { profile } } = this.context;

        const ownerType = ownerId === profile.id ? OwnerTypeV1.PROFILE : OwnerTypeV1.TEAM;
        dispatch(createCollection({name, ownerType, ownerId}));
    }

    render() {
        const {
            fields: { name, ownerId },
            handleSubmit,
            memberships,
        } = this.props;
        const { auth: { profile } } = this.context;
        const choices = [
            {label: t('My Collections'), value: profile.id},
        ];
        memberships.forEach(({team}) => {
            choices.push({label: team.name, value: team.id});
        });
        return (
            <Form onSubmit={handleSubmit(this.submit)}>
                <FormLabel text={t('New Collection')} />
                <FormTextField
                    placeholder={t('Collection Name')}
                    {...name}
                />

                <FormLabel text={t('In')} />
                <FormSelectField
                    choices={choices}
                    {...ownerId}
                />

                <PrimaryRoundedButton
                    label={t('Create & Add To')}
                    onTouchTap={handleSubmit(this.submit)}
                    style={{float: 'right', marginTop: 35}}
                />
            </Form>
        );
    }
}

NewCollectionForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    formSubmitted: PropTypes.bool,
    formSubmitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    id: PropTypes.string,
    memberships: PropTypes.array.isRequired,
    onComplete: PropTypes.func,
    resetForm: PropTypes.func.isRequired,
};

NewCollectionForm.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
};

export default reduxForm(
    {
        form: CREATE_COLLECTION,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
        validate: collectionValidator,
    },
)(NewCollectionForm);

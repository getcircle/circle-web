import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { createCollection } from '../actions/collections';
import { CREATE_COLLECTION } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { hideFormDialog } from '../actions/forms';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { collectionValidator } from '../utils/validators';
import { routeToCollection } from '../utils/routes';

import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormTextField from './FormTextField';

const { OwnerTypeV1 } = services.post.containers.CollectionV1;

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(CREATE_COLLECTION);
        return {
            formSubmitting: formState.get('submitting'),
            id: formState.getIn(['payload', 'result']),
            visible: formState.get('visible'),
        };
    }
);

class CreateCollectionForm extends Component {

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
        }

        if (this.props.visible && !this.props.id && nextProps.id) {
            routeToCollection({id: nextProps.id});
        }
    }

    submit = (form, dispatch) => {
        const { name } = form;
        const { ownerId, ownerType } = this.props;
        dispatch(createCollection({name, ownerType, ownerId}));
    }

    handleCancel = () => {
        this.props.dispatch(hideFormDialog(CREATE_COLLECTION));
    }

    render() {
        const {
            fields: { name },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;
        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.CREATE_COLLECTION}
                submitLabel={t('Go To Collection')}
                submiting={formSubmitting}
                title={t('New Collection')}
                visible={visible}
            >
                <FormLabel text={t('Collection Name')} />
                <FormTextField
                    placeholder={t('Name your Collection')}
                    {...name}
                />
            </FormDialog>
        );
    }
}

CreateCollectionForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    formSubmitted: PropTypes.bool,
    formSubmitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    id: PropTypes.string,
    ownerId: PropTypes.string.isRequired,
    ownerType: PropTypes.oneOf(Object.values(OwnerTypeV1)).isRequired,
    resetForm: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
};

export default reduxForm(
    {
        form: CREATE_COLLECTION,
        fields: ['name'],
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
        validate: collectionValidator,
    },
    selector,
)(CreateCollectionForm);

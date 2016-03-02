import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { ADD_TO_COLLECTION } from '../constants/forms';
import { initializeCollectionsFilter } from '../actions/collections';

import Form from './Form';
import FormLabel from './FormLabel';
import FormCollectionsSelector from './FormCollectionsSelector';

const FIELD_NAMES = ['collections'];

export class AddToCollectionForm extends Component {

    componentWillMount() {
        this.setInitialValues(this.props);
        this.props.dispatch(initializeCollectionsFilter(this.props.editableCollections));
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(ADD_TO_COLLECTION, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    render() {
        const {
            editableCollections,
            fields: { collections },
            inputClassName,
            inputContainerStyle,
            inputStyle,
            listContainerStyle,
            ...other,
        } = this.props;
        return (
            <Form {...other}>
                <FormLabel text={t('Add To...')} />
                <FormCollectionsSelector
                    editableCollections={editableCollections}
                    inputClassName={inputClassName}
                    inputContainerStyle={inputContainerStyle}
                    inputStyle={inputStyle}
                    listContainerStyle={listContainerStyle}
                    {...collections}
                />
            </Form>
        );
    }

}

AddToCollectionForm.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
    fields: PropTypes.object.isRequired,
    inputClassName: PropTypes.string,
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export default reduxForm(
    {
        form: ADD_TO_COLLECTION,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
)(AddToCollectionForm);

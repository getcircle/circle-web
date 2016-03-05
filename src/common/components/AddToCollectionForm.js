import { isEqual } from 'lodash';
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

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.editableCollections, nextProps.editableCollections)) {
            this.props.dispatch(initializeCollectionsFilter(nextProps.editableCollections));
        }
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(ADD_TO_COLLECTION, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    render() {
        const {
            addingNewCollection,
            editableCollections,
            fields: { collections },
            inputClassName,
            inputContainerStyle,
            inputStyle,
            listContainerStyle,
            memberships,
            newCollectionAllowed,
            onCloseNewForm,
            onOpenNewForm,
            ...other,
        } = this.props;

        let label;
        if (!addingNewCollection) {
            label = <FormLabel text={t('Add To...')} />;
        }

        return (
            <Form {...other}>
                {label}
                <FormCollectionsSelector
                    addingNewCollection={addingNewCollection}
                    editableCollections={editableCollections}
                    inputClassName={inputClassName}
                    inputContainerStyle={inputContainerStyle}
                    inputStyle={inputStyle}
                    listContainerStyle={listContainerStyle}
                    memberships={memberships}
                    newCollectionAllowed={newCollectionAllowed}
                    onCloseNewForm={onCloseNewForm}
                    onOpenNewForm={onOpenNewForm}
                    {...collections}
                />
            </Form>
        );
    }

}

AddToCollectionForm.propTypes = {
    addingNewCollection: PropTypes.bool,
    cache: PropTypes.object.isRequired,
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    inputClassName: PropTypes.string,
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    memberships: PropTypes.array,
    newCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    newCollectionAllowed: PropTypes.bool,
    onCloseNewForm: PropTypes.func,
    onOpenNewForm: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export default reduxForm(
    {
        form: ADD_TO_COLLECTION,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
)(AddToCollectionForm);

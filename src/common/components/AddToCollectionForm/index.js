import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import { ADD_TO_COLLECTION } from '../../constants/forms';
import { initializeCollectionsFilter } from '../../actions/collections';
import { retrieveCollection } from '../../reducers/denormalizations';
import * as selectors from '../../selectors';

import Form from '../Form';
import FormLabel from '../FormLabel';
import FormCollectionsSelector from '../FormCollectionsSelector';
import NewCollectionForm from './NewCollectionForm';

const FIELD_NAMES = ['collections'];

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.createCollectionSelector,
    ],
    (cacheState, collectionState) => {
        return {
            cache: cacheState.toJS(),
            newCollectionId: collectionState.get('id'),
        };
    }
);

export class AddToCollectionForm extends Component {

    componentWillMount() {
        this.setInitialValues(this.props);
        this.props.dispatch(initializeCollectionsFilter(this.props.editableCollections));
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.newCollectionId && nextProps.newCollectionId) {
            this.addNewCollection(nextProps);
        }
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(ADD_TO_COLLECTION, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    addNewCollection(props) {
        const {
            cache,
            fields: { collections: { onChange, value: collections } },
            handleSubmit,
            newCollectionId,
        } = props;

        const existing = collections.find(c => c.id === newCollectionId);
        if (!existing) {
            const addedCollection = retrieveCollection(newCollectionId, cache);
            collections.push(addedCollection);
            onChange(collections);
            handleSubmit();
            props.dispatch(initializeCollectionsFilter(props.editableCollections));
        }
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
            onNewCollection,
            ...other,
        } = this.props;

        if (addingNewCollection) {
            return (
                <NewCollectionForm
                    memberships={memberships}
                    onComplete={this.handleCollectionAdded}
                    style={{padding: 0}}
                />
            );
        } else {
            return (
                <Form {...other}>
                    <FormLabel text={t('Add To...')} />
                    <FormCollectionsSelector
                        editableCollections={editableCollections}
                        inputClassName={inputClassName}
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                        listContainerStyle={listContainerStyle}
                        newCollectionAllowed={newCollectionAllowed}
                        onNewCollection={onNewCollection}
                        {...collections}
                    />
                </Form>
            );
        }
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
    memberships: PropTypes.array.isRequired,
    newCollectionAllowed: PropTypes.bool,
    newCollectionId: PropTypes.string,
    onNewCollection: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export default reduxForm(
    {
        form: ADD_TO_COLLECTION,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
    selector,
)(AddToCollectionForm);

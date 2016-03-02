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
        const newCollectionId = collectionState.get('id');
        const newCollection = retrieveCollection(newCollectionId, cacheState.toJS());
        return {
            newCollection,
        };
    }
);

export class AddToCollectionForm extends Component {

    componentWillMount() {
        this.setInitialValues(this.props);
        this.props.dispatch(initializeCollectionsFilter(this.props.editableCollections));
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.newCollection && nextProps.newCollection) {
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
            fields: { collections: { onChange, value: collections } },
            handleSubmit,
            newCollection,
        } = props;

        const existing = collections && collections.find(c => {
            return c.id === newCollection.id
        });
        if (!existing) {
            collections.push(newCollection);
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
    newCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    newCollectionAllowed: PropTypes.bool,
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

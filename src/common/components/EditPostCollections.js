import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { addPostToCollection, removeFromCollection } from '../actions/collections';
import { EDIT_POST_COLLECTIONS } from '../constants/forms';
import * as selectors from '../selectors';

import Form from './Form';
import FormLabel from './FormLabel';
import FormCollectionSelector from './FormCollectionSelector';

const FIELD_NAMES = ['collections'];

const selector = selectors.createImmutableSelector(
    [selectors.editPostCollectionsSelector],
    (editPostCollectionsState) => {
        return {
            ids: editPostCollectionsState.get('ids'),
            collectionToItem: editPostCollectionsState.get('collectionToItem'),
        };
    }
);

class EditPostCollections extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.collections !== this.props.collections) {
            this.setInitialValues(nextProps);
        }
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        debugger;
        const action = initialize(EDIT_POST_COLLECTIONS, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    buildHandleChange = (onChange) => (collections) => {
        onChange(collections);
        const { dispatch, post } = this.props;
        const collectionIds = Immutable.Set();
        for (let collection of collections) {
            collectionIds.add(collection.id);
            if (!this.props.ids.has(collection.id)) {
                dispatch(addPostToCollection(post, collection));
            }
        }

        // XXX This is fucked
        for (let collectionId of this.props.ids) {
            if (!collectionIds.has(collectionId)) {
                const collectionItem = this.props.collectionToItem.get(collectionId);
                dispatch(removeFromCollection({collectionId, collectionItemId: collectionItem.id}));
            }
        }
    }

    render() {
        const {
            fields: { collections },
            ...other,
        } = this.props;
        return (
            <Form {...other}>
                <FormLabel text={t('Collections')} />
                <FormCollectionSelector
                    {...collections}
                    onChange={this.buildHandleChange(collections.onChange)}
                />
            </Form>
        );
    }

};

EditPostCollections.propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    resetForm: PropTypes.func.isRequired,
};

export default reduxForm(
    {
        form: EDIT_POST_COLLECTIONS,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
    selector,
)(EditPostCollections);

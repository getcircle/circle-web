import { isEqual } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { addPostToCollection, removeFromCollection } from '../actions/collections';
import { EDIT_POST_COLLECTIONS } from '../constants/forms';

import Form from './Form';
import FormLabel from './FormLabel';
import FormCollectionSelector from './FormCollectionSelector';

const FIELD_NAMES = ['collections'];

// - should take an array of available collections the user can select
// - needs to have some public "submit" method that can be called from the publish button
// - should take an array of current collections the post is a part of
// -> on submit we'll diff between whats in current collections and current
// form values, calling add_to_collections and remove_from_collections as
// required

class EditPostCollections extends Component {

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.collections, this.props.collections)) {
            this.setInitialValues(nextProps);
        }
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(EDIT_POST_COLLECTIONS, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    submit = (form, dispatch) => {
        debugger;
    }

    render() {
        const {
            editableCollections,
            fields: { collections },
            ...other,
        } = this.props;
        return (
            <Form {...other}>
                <FormLabel text={t('Collections')} />
                <FormCollectionSelector
                    editableCollections={editableCollections}
                    {...collections}
                />
            </Form>
        );
    }

};

EditPostCollections.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
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
)(EditPostCollections);

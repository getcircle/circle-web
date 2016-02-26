import { isEqual } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { EDIT_POST_COLLECTIONS } from '../constants/forms';

import Form from './Form';
import FormLabel from './FormLabel';
import FormCollectionSelector from './FormCollectionSelector';

const FIELD_NAMES = ['collections'];

/**
 * Form for editing collections a post belongs to.
 *
 * Because we save the collections a form belongs to when you publish the post,
 * this is mostly used as a state container for the collections the user has
 * added. The post gets added to the collections within the post editor.
 */
class EditPostCollections extends Component {

    componentWillReceiveProps(nextProps) {
        if (
            (this.props.pristine || nextProps.pristine) &&
            !isEqual(nextProps.collections, this.props.collections)
        ) {
            this.setInitialValues(nextProps);
        }
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(EDIT_POST_COLLECTIONS, {collections}, FIELD_NAMES);
        dispatch(action);
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
    pristine: PropTypes.bool,
    resetForm: PropTypes.func.isRequired,
};

export default reduxForm(
    {
        form: EDIT_POST_COLLECTIONS,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
)(EditPostCollections);

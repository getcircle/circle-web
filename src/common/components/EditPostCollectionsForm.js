import { isEqual } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';

import t from '../utils/gettext';
import { EDIT_POST_COLLECTIONS } from '../constants/forms';
import { initializeCollectionsFilter } from '../actions/collections';

import Form from './Form';
import FormLabel from './FormLabel';
import FormTokenizedCollectionsSelector from './FormTokenizedCollectionsSelector';

const FIELD_NAMES = ['collections'];

class EditPostCollectionsForm extends Component {

    componentWillMount() {
        if (this.props.collectionsLoaded) {
            this.setInitialValues(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.collectionsLoaded && nextProps.collectionsLoaded) {
            this.setInitialValues(nextProps);
        }

        if (!isEqual(this.props.editableCollections, nextProps.editableCollections)) {
            this.props.dispatch(initializeCollectionsFilter(nextProps.editableCollections));
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
                <FormTokenizedCollectionsSelector
                    editableCollections={editableCollections}
                    {...collections}
                />
            </Form>
        );
    }

};

EditPostCollectionsForm.propTypes = {
    collections: PropTypes.array,
    collectionsLoaded: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
    fields: PropTypes.object.isRequired,
};

export default reduxForm(
    {
        form: EDIT_POST_COLLECTIONS,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
)(EditPostCollectionsForm);

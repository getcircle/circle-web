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

    state = {
        addingNewCollection: false,
    }

    componentWillMount() {
        if (this.props.collectionsLoaded) {
            this.setInitialValues(this.props);
        }

        if (this.props.editableCollections) {
            this.props.dispatch(initializeCollectionsFilter(this.props.editableCollections));
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

    handleOpenNewForm = () => {
        this.setState({addingNewCollection: true});
    }

    handleCloseNewForm = () => {
        this.setState({addingNewCollection: false});
    }

    setInitialValues(props) {
        const { dispatch, collections } = props;
        const action = initialize(EDIT_POST_COLLECTIONS, {collections}, FIELD_NAMES);
        dispatch(action);
    }

    render() {
        const {
            editableCollections,
            memberships,
            fields: { collections },
            ...other,
        } = this.props;
        const { addingNewCollection } = this.state;
        return (
            <Form {...other}>
                <FormLabel text={t('Collections')} />
                <FormTokenizedCollectionsSelector
                    addingNewCollection={addingNewCollection}
                    editableCollections={editableCollections}
                    memberships={memberships}
                    newCollectionAllowed={true}
                    onCloseNewForm={this.handleCloseNewForm}
                    onOpenNewForm={this.handleOpenNewForm}
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
    memberships: PropTypes.array,
};

export default reduxForm(
    {
        form: EDIT_POST_COLLECTIONS,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
)(EditPostCollectionsForm);

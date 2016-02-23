import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';

import { hideRearrangeCollectionsModal } from '../actions/collections';
import { REARRANGE_COLLECTIONS } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import { services } from 'protobufs';
import t from '../utils/gettext';

import FormDialog from './FormDialog';
import FormSortableList from './FormSortableList';

const fieldNames = ['collections'];

const selector = selectors.createImmutableSelector(
    [
        selectors.rearrangeCollectionsSelector,
    ],
    (
        rearrangeState,
    ) => {
        return {
            formSubmitting: rearrangeState.get('formSubmitting'),
            visible: rearrangeState.get('modalVisible'),
        };
    }
);

const styles = {
    label: {
        display: 'block',
        fontSize: '1.4rem',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'left',
    }
};

export default class CollectionsRearrangeForm extends Component {

    static propTypes = {
        collections: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.CollectionV1)
        ).isRequired,
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitted: PropTypes.bool,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
            this.setInitialValues();
        }
    }

    setInitialValues() {
        const { collections, dispatch } = this.props;

        const action = initialize(REARRANGE_COLLECTIONS, {
            collections: collections.map(c => {return {id: c.id, text: c.name}}),
        }, fieldNames);

        dispatch(action);
    }

    submit = (values, dispatch) => {
        // TODO: calculate diffs, send rearrange action
    }

    handleCancel = () => {
        this.props.dispatch(hideRearrangeCollectionsModal());
    }

    render() {
        const {
            fields: { collections },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.CREATE_TEAM}
                submitLabel={t('Update')}
                submitting={formSubmitting}
                title={t('Rearrange Collections')}
                visible={visible}
            >
                <label style={styles.label}>
                    {t('Drag and drop to rearrange Collections.')}
                </label>
                <FormSortableList {...collections} />
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: REARRANGE_COLLECTIONS,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
    selector
)(CollectionsRearrangeForm);

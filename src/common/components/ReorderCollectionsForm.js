import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';

import { hideFormDialog } from '../actions/forms';
import { REORDER_COLLECTIONS } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import { services } from 'protobufs';
import t from '../utils/gettext';
import { getPositionDiffs } from '../utils/collections';
import { reorderCollections } from '../actions/collections';

import FormDialog from './FormDialog';
import FormSortableList from './FormSortableList';

const { OwnerTypeV1 } = services.post.containers.CollectionV1;
const fieldNames = ['collections'];

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(REORDER_COLLECTIONS);
        return {
            formSubmitting: formState.get('submitting'),
            visible: formState.get('visible'),
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

export default class ReorderCollectionsForm extends Component {

    static propTypes = {
        collections: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.CollectionV1)
        ).isRequired,
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitted: PropTypes.bool,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        ownerId: PropTypes.string.isRequired,
        ownerType: PropTypes.oneOf(Object.values(OwnerTypeV1)),
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

        const action = initialize(REORDER_COLLECTIONS, {
            collections: collections.map(c => {return {collection: c, id: c.id, text: c.name}}),
        }, fieldNames);

        dispatch(action);
    }

    submit = ({ collections }, dispatch) => {
        const { fields, ownerId, ownerType } = this.props;
        const diffs = getPositionDiffs(collections, fields.collections.initialValue);
        dispatch(reorderCollections(ownerId, ownerType, diffs));
    }

    handleCancel = () => {
        this.props.dispatch(hideFormDialog(REORDER_COLLECTIONS));
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
      form: REORDER_COLLECTIONS,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
    selector
)(ReorderCollectionsForm);

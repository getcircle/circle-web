import React, { PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { EDIT_COLLECTION } from '../../constants/forms';
import { updateCollection } from '../../actions/collections';
import { hideFormDialog } from '../../actions/forms';
import { PAGE_TYPE } from '../../constants/trackerProperties';
import * as selectors from '../../selectors';
import t from '../../utils/gettext';
import { collectionValidator } from '../../utils/validators';

import CSSComponent from  '../CSSComponent';
import FormDialog from '../FormDialog';
import FormLabel from '../FormLabel';
import FormSortableList from '../FormSortableList';
import FormTextField from '../FormTextField';

import ItemMenu, { MENU_CHOICES } from './ItemMenu';

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(EDIT_COLLECTION);
        return {
            formSubmitting: formState.get('sumbitting'),
            visible: formState.get('visible'),
        };
    }
);

const fieldNames = [
    'items',
    'name',
];

const styles = {
    label: {
        display: 'block',
        fontSize: '1.4rem',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'left',
    }
};

export class EditCollectionForm extends CSSComponent {

    static propTypes = {
        collection: PropTypes.instanceOf(services.post.containers.CollectionV1).isRequired,
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
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
        const { collection, dispatch } = this.props;

        const action = initialize(EDIT_COLLECTION, {
            items: collection.items.map(i => {return {id: i.id, text: i.post.title}}),
            name: collection.name,
        }, fieldNames);

        dispatch(action);
    }

    handleMenuChoice = (choice, profile) => {
        switch(choice) {
        case MENU_CHOICES.REMOVE:
            // TODO: dispatch remove from collection action
            break;
        }
    }

    submit = ({ name, items }, dispatch) => {
        const { collection } = this.props;
        collection.setName(name);

        // TODO: calculate diffs, send reorder action
        dispatch(updateCollection(collection));
    }

    handleCancel() {
        this.props.dispatch(hideFormDialog(EDIT_COLLECTION));
    }

    render() {
        const {
            collection,
            fields: { items, name },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;

        let sortItems;
        // XXX temporarily disable until we support
        if (false && collection.items.length) {
            sortItems = (
                <div>
                    <label style={styles.label}>
                        {t('Drag and drop to rearrange Knowledge.')}
                    </label>
                    <FormSortableList
                        MenuComponent={ItemMenu}
                        onMenuChoice={this.handleMenuChoice}
                        {...items}
                    />
                </div>
            );
        }

        return (
            <FormDialog
                modal={true}
                onCancel={::this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.EDIT_COLLECTION}
                submitLabel={t('Update')}
                submitting={formSubmitting}
                title={t('Edit Collection')}
                visible={visible}
            >
                <FormLabel text={t('Collection Name')} />
                <FormTextField
                    placeholder={t('Name your Collection')}
                    {...name}
                 />
                 {sortItems}
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: EDIT_COLLECTION,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: collectionValidator,
    },
    selector
)(EditCollectionForm);

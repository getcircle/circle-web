import React, { PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';
import { difference } from 'lodash';

import { EDIT_COLLECTION } from '../../constants/forms';
import { updateCollection, removePostFromCollections } from '../../actions/collections';
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

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
            this.setInitialValues();
        }
    }

    setInitialValues() {
        const { collection, dispatch, items = [] } = this.props;

        const action = initialize(EDIT_COLLECTION, {
            items: items.map((item, index) => {
                return {id: item.id, text: item.post.title, post: item.post};
            }),
            name: collection.name,
        }, fieldNames);

        dispatch(action);
    }

    handleMenuChoice = (choice, item) => {
        const { fields: { items: { onChange, value } } } = this.props;
        switch(choice) {
        case MENU_CHOICES.REMOVE:
            const newItems = value.slice();
            const index = value.findIndex(i => i.id === item.id);
            newItems.splice(index, 1);
            onChange(newItems);
            break;
        }
    }

    submit = ({ name, items }, dispatch) => {
        const { collection, fields } = this.props;
        collection.setName(name);
        // TODO: have a function which returns an array of PositionDiffV1s when
        // given an array of original items and an array of newly sorted items

        // TODO: calculate diffs, send reorder action
        //
        const removedItems = difference(fields.items.initialValue, items);
        const postsToRemove = removedItems.map(item => item.post);
        // TODO this should be a batch operation
        for (let post of postsToRemove) {
            dispatch(removePostFromCollections(post, [collection]));
        }
        dispatch(updateCollection(collection));
    }

    handleCancel() {
        this.props.dispatch(hideFormDialog(EDIT_COLLECTION));
    }

    render() {
        const {
            fields: { items, name },
            formSubmitting,
            handleSubmit,
            items: collectionItems,
            visible,
        } = this.props;

        let sortItems;
        if (collectionItems && collectionItems.length) {
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

EditCollectionForm.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1).isRequired,
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    items: PropTypes.array,
    formSubmitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
};

export default reduxForm(
    {
      form: EDIT_COLLECTION,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: collectionValidator,
    },
    selector
)(EditCollectionForm);

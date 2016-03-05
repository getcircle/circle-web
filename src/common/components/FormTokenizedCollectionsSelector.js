import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteCollection, {
    createCollectionItem,
    NEW_ITEM_POSITION,
} from './AutoCompleteCollection';
import FormTokenizedSelector from './FormTokenizedSelector';

function getItemName(collection) {
    return collection.display_name;
}

const FormTokenizedCollectionsSelector = (props) => {
    const {
        active,
        addingNewCollection,
        editableCollections,
        memberships,
        onChange,
        onCloseNewForm,
        onOpenNewForm,
        value,
        ...other
    } = props;
    const collections = value || [];
    const handleSelectItem = (item, event) => {
        const index = existingCollectionIds.indexOf(item.id);
        if (index >= 0) {
            collections.splice(index, 1);
        } else {
            collections.push(item);
        }
        onChange(collections);
    };
    const styles = {
        listContainer: {
            width: 392,
        },
        newCollection: {
            paddingLeft: 35,
            paddingRight: 35,
            position: 'absolute',
            width: 392,
        },
    }
    const autoComplete = (
        <AutoCompleteCollection
            addingNewCollection={addingNewCollection}
            collections={editableCollections}
            focused={active}
            hasItemDivider={false}
            hideSelectedCollections={true}
            ignoreCollectionIds={collections.map(collection => collection.id)}
            memberships={memberships}
            newCollectionButtonText={t('Create')}
            newCollectionPosition={NEW_ITEM_POSITION.BOTTOM}
            newCollectionStyle={styles.newCollection}
            onCloseNewForm={onCloseNewForm}
            onOpenNewForm={onOpenNewForm}
            onSelectItem={handleSelectItem}
            placeholder={t('Search Collections')}
            resultFactoryFunction={createCollectionItem}
        />
    );
    return (
        <FormTokenizedSelector
            autoCompleteElement={autoComplete}
            getItemName={getItemName}
            listContainerStyle={styles.listContainer}
            onChange={onChange}
            value={value}
            {...other}
        />
    );
}

FormTokenizedCollectionsSelector.propTypes = {
    active: PropTypes.bool,
    addingNewCollection: PropTypes.bool,
    editableCollections: PropTypes.array,
    memberships: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onCloseNewForm: PropTypes.func,
    onOpenNewForm: PropTypes.func,
    value: PropTypes.array,
};

export default FormTokenizedCollectionsSelector;

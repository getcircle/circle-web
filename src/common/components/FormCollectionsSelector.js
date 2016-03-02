import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteAddToCollection, {
    createCollectionItem,
    createNewCollectionItem,
    TYPES,
} from './AutoCompleteAddToCollection';

const FormCollectionsSelector = (props) => {
    const {
        editableCollections,
        newCollectionAllowed,
        onChange,
        onNewCollection,
        onSelectItem,
        value,
        ...other,
    } = props;
    const collections = value ? value.slice() : [];
    const existingCollectionIds = collections.map(collection => collection.id);

    const handleSelectItem = (item, event) => {
        if (item === TYPES.ADD_COLLECTION) {
            onNewCollection(event);
        } else {
            const index = existingCollectionIds.indexOf(item.id);
            if (index >= 0) {
                collections.splice(index, 1);
            } else {
                collections.push(item);
            }
            onChange(collections);
        }
    };

    return (
        <div>
            <AutoCompleteAddToCollection
                collections={editableCollections}
                focused={true}
                hasItemDivider={false}
                ignoreCollectionIds={collections.map(collection => collection.id)}
                newCollectionFactoryFunction={newCollectionAllowed ? createNewCollectionItem : null}
                onSelectItem={handleSelectItem}
                placeholder={t('Search Collections')}
                resultFactoryFunction={createCollectionItem}
                {...other}
            />
        </div>
    );
};

FormCollectionsSelector.propTypes = {
    editableCollections: PropTypes.array,
    inputClassName: PropTypes.string,
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    newCollectionAllowed: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onNewCollection: PropTypes.func,
    onSelectItem: PropTypes.func,
    value: PropTypes.array,
};

FormCollectionsSelector.defaultProps = {
    onSelectItem: () => {},
};

export default FormCollectionsSelector;

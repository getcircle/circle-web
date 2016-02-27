import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteAddToCollection, { createCollectionItem } from './AutoCompleteAddToCollection';

const FormCollectionsSelector = (props) => {
    const { editableCollections, onChange, onSelectItem, value, ...other } = props;
    const collections = value ? value.slice() : [];
    const existingCollectionIds = collections.map(collection => collection.id);

    const handleSelectItem = (item) => {
        const index = existingCollectionIds.indexOf(item.id);
        if (index >= 0) {
            collections.splice(index, 1);
        } else {
            collections.push(item);
        }
        onChange(collections);
    };

    return (
        <div>
            <AutoCompleteAddToCollection
                collections={editableCollections}
                focused={true}
                hasItemDivider={false}
                ignoreCollectionIds={collections.map(collection => collection.id)}
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
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func,
    value: PropTypes.array,
};

FormCollectionsSelector.defaultProps = {
    onSelectItem: () => {},
};

export default FormCollectionsSelector;

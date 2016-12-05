import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteCollection, {
    createCollectionItemWithIcon,
    NEW_ITEM_POSITION,
} from './AutoCompleteCollection';

const FormCollectionsSelector = (props) => {
    const {
        editableCollections,
        listContainerStyle,
        memberships,
        newCollectionAllowed,
        onChange,
        onSelectItem,
        value,
        ...other,
    } = props;
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

    const styles = {
        listContainer: {
            paddingLeft: 15,
            paddingRight: 15,
        },
    };

    return (
        <div>
            <AutoCompleteCollection
                collections={editableCollections}
                focused={true}
                hasItemDivider={false}
                hideSearchWhenAdding={true}
                ignoreCollectionIds={collections.map(collection => collection.id)}
                listContainerStyle={listContainerStyle}
                memberships={memberships}
                newCollectionButtonText={t('Create & Add To')}
                newCollectionPosition={NEW_ITEM_POSITION.TOP}
                newCollectionStyle={{...styles.listContainer, ...listContainerStyle}}
                onSelectItem={handleSelectItem}
                placeholder={t('Search Collections')}
                resultFactoryFunction={createCollectionItemWithIcon}
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
    memberships: PropTypes.array,
    newCollectionAllowed: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func,
    value: PropTypes.array,
};

FormCollectionsSelector.defaultProps = {
    onSelectItem: () => {},
};

export default FormCollectionsSelector;

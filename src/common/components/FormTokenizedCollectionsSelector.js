import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteCollection, { createCollectionItem } from './AutoCompleteCollection';
import FormTokenizedSelector from './FormTokenizedSelector';

function getItemName(collection) {
    return collection.display_name;
}

const FormTokenizedCollectionsSelector = (props) => {
    const { active, editableCollections, onChange, value, ...other } = props;
    const collections = value || [];
    const autoComplete = (
        <AutoCompleteCollection
            collections={editableCollections}
            focused={active}
            hasItemDivider={false}
            ignoreCollectionIds={collections.map(collection => collection.id)}
            placeholder={t('Search Collections')}
            resultFactoryFunction={createCollectionItem}
        />
    );
    return (
        <FormTokenizedSelector
            autoCompleteElement={autoComplete}
            getItemName={getItemName}
            onChange={onChange}
            value={value}
            {...other}
        />
    );
}

FormTokenizedCollectionsSelector.propTypes = {
    active: PropTypes.bool,
    editableCollections: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
};

export default FormTokenizedCollectionsSelector;

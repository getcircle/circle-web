import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteCollection, { createCollectionItem } from './AutoCompleteCollection';
import FormTokenizedSelector from './FormTokenizedSelector';

function getItemName(collection) {
    // TODO if this is owned by a team add [<team name>]
    return collection.name;
}

const FormCollectionSelector = ({ active, onChange, value, ...other }) => {
    const collections = value || [];
    const autoComplete = (
        <AutoCompleteCollection
            focused={active}
            hasItemDivider={false}
            ignoreCollectionIds={collections.map(collection => collection.id)}
            placeholder={t('Search by Name')}
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

FormCollectionSelector.propTypes = {
    active: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
};

export default FormCollectionSelector;

import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteProfile, { createProfileWithTitle } from './AutoCompleteProfile';
import FormTokenizedSelector from './FormTokenizedSelector';

function getItemName(profile) {
    return profile.full_name;
}

const FormPeopleSelector = ({ active, ignoreProfileIds, onChange, value, ...other }) => {
    const profiles = value || [];
    const ignoreIds = profiles.map(profile => profile.id);
    ignoreIds.push(...ignoreProfileIds);
    const autoComplete = (
        <AutoCompleteProfile
            focused={active}
            hasItemDivider={false}
            ignoreProfileIds={ignoreIds}
            placeholder={t('Search by Name')}
            resultFactoryFunction={createProfileWithTitle}
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
};

FormPeopleSelector.propTypes = {
    active: PropTypes.bool,
    ignoreProfileIds: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
};

FormPeopleSelector.defaultProps = {
    ignoreProfileIds: [],
};

export default FormPeopleSelector;

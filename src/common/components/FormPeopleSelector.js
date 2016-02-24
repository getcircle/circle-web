import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import AutoCompleteProfile, { createProfileWithTitle } from './AutoCompleteProfile';
import FormTokenizedSelector from './FormTokenizedSelector';

function getItemName(profile) {
    return profile.full_name;
}

const FormPeopleSelector = ({ active, onChange, value, ...other }) => {
    const profiles = value || [];
    const autoComplete = (
        <AutoCompleteProfile
            focused={active}
            hasItemDivider={false}
            ignoreProfileIds={profiles.map(profile => profile.id)}
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
    listContainerStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    value: PropTypes.array,
};

export default FormPeopleSelector;

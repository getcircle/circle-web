import { MenuItem, SelectField } from 'material-ui';
import React, { PropTypes } from 'react';

import FormFieldError from './FormFieldError';

const FormSelectField = ({choices, error, invalid, onChange, name, touched, ...other}) => {
    const showError = invalid && touched;

    const handleChange = (event, index, value) => {
        onChange(value);
    };

    const items = choices.map(({label, value}, i) => {
        return (
            <MenuItem
                key={`form-select-choice-${name}-${i}`}
                primaryText={label}
                value={value}
            />
        );
    });

    let styles = {
        border: '1px solid rgba(0, 0, 0, 0.1)',
        height: 36,
    };
    if (showError) {
        styles.border = '1px solid rgba(200, 0, 0, 0.8)';
    }

    return (
        <div>
            <SelectField
                children={items}
                fullWidth={true}
                iconStyle={{top: 8}}
                invalid={invalid}
                labelStyle={{lineHeight: '44px'}}
                name={name}
                onChange={handleChange}
                style={styles}
                touched={touched}
                underlineStyle={{borderBottom: 'none'}}
                {...other}
            />
            <FormFieldError error={showError ? error : undefined} />
        </div>
    );
};

FormSelectField.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    touched: PropTypes.bool,
    value: PropTypes.node,
};

export default FormSelectField;

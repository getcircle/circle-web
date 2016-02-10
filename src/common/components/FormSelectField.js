import { MenuItem, DropDownMenu } from 'material-ui';
import React, { PropTypes } from 'react';

import FormFieldError from './FormFieldError';

const encodeValue = value => `val-${ JSON.stringify(value) }`;
const decodeValue = value => JSON.parse(value.substr(4));

const FormSelectField = (props, {muiTheme}) => {
    const {
        choices,
        error,
        invalid,
        onChange,
        name,
        touched,
        value,
        ...other,
    } = props;

    const showError = invalid && touched;

    const handleChange = (event, index, value) => {
        onChange(decodeValue(value));
    };

    const items = choices.map(({label, value}, i) => {
        return (
            <MenuItem
                key={`form-select-choice-${name}-${i}`}
                primaryText={label}
                value={encodeValue(value)}
            />
        );
    });

    const styles = {
        ...muiTheme.luno.form.field,
        height: 36,
    };
    if (showError) {
        Object.assign(styles, muiTheme.luno.form.fieldError);
    }

    return (
        <div>
            <DropDownMenu
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
                value={encodeValue(value)}
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

FormSelectField.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default FormSelectField;

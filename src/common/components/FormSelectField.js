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

    const handleChange = (event, index, value) => {
        onChange(decodeValue(value));
    };

    const styles = {
        item: {
            margin: 0,
            paddingLeft: 12,
        },
        label: {
            lineHeight: 0,
            paddingLeft: 12,
            paddingTop: 20,
        },
        main: {
            ...muiTheme.luno.form.field,
            height: 40,
            padding: 0,
            textAlign: 'left',
        },
        menu: {
            width: 128,
        },
        underline: {
            borderBottom: 'none',
            borderTop: 'none',
        },
    };
    const showError = invalid && touched;
    if (showError) {
        Object.assign(styles.main, muiTheme.luno.form.fieldError);
    }

    const items = choices.map(({label, value}, i) => {
        return (
            <MenuItem
                innerDivStyle={styles.item}
                key={`form-select-choice-${name}-${i}`}
                primaryText={label}
                value={encodeValue(value)}
            />
        );
    });

    return (
        <div>
            <DropDownMenu
                children={items}
                fullWidth={true}
                iconStyle={{top: 8}}
                invalid={invalid}
                labelStyle={styles.label}
                menuStyle={styles.menu}
                name={name}
                onChange={handleChange}
                style={styles.main}
                touched={touched}
                underlineStyle={styles.underline}
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

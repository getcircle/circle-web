import React, { PropTypes } from 'react';

import FormFieldError from './FormFieldError';

const FormTextField = ({error, invalid, touched, ...other}, {muiTheme}) => {
    const styles = {
        ...muiTheme.luno.form.field,
        height: 40,
    };
    const showError = invalid && touched;
    if (showError) {
        Object.assign(styles, muiTheme.luno.form.fieldError);
    }
    return (
        <div>
            <input
                autoComplete="off"
                invalid={invalid}
                style={styles}
                touched={touched}
                type="text"
                {...other}
            />
            <FormFieldError error={showError ? error : undefined} />
        </div>
    );
};

FormTextField.propTypes = {
    invalid: PropTypes.bool,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    touched: PropTypes.bool,
    value: PropTypes.string,
};

FormTextField.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default FormTextField;

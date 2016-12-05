import React, { PropTypes } from 'react';

import FormFieldError from './FormFieldError';

const FormTextArea = ({error, invalid, touched, value, ...other}, {muiTheme}) => {
    const styles = {
        ...muiTheme.luno.form.field,
        height: 72,
        resize: 'none',
    };
    const showError = invalid && touched;
    if (showError) {
        Object.assign(styles, muiTheme.luno.form.fieldError);
    }
    return (
        <div>
            <textarea
                invalid={invalid}
                style={styles}
                touched={touched}
                value={value || ''} // See https://github.com/facebook/react/issues/2533
                {...other}
            />
            <FormFieldError error={showError ? error : undefined} />
        </div>
    );
};

FormTextArea.propTypes = {
    invalid: PropTypes.bool,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    touched: PropTypes.bool,
    value: PropTypes.string,
};

FormTextArea.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default FormTextArea;

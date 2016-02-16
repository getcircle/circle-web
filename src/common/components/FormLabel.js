import React, { PropTypes } from 'react';

import t from '../utils/gettext';


const FormLabel = ({ optional, text }, { muiTheme }) => {
    const optionalText = optional ? t('(optional)') : '';

    const styles = {
        mainText: {
            textTransform: 'uppercase',
        }
    };

    return (
        <label style={muiTheme.luno.form.label}>
            <span style={styles.mainText}>{text}</span>
            <span> {optionalText}</span>
        </label>
    );
}

FormLabel.propTypes = {
    optional: PropTypes.bool,
    text: PropTypes.string.isRequired,
};

FormLabel.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default FormLabel;

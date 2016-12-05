import { merge } from 'lodash';
import React, { PropTypes } from 'react';

import RoundedButton from './RoundedButton';

const PrimaryRoundedButton = ({ label, labelStyle, style, ...other }, { muiTheme }) => {
    const styles = {
        button: {
            backgroundColor: muiTheme.luno.tintColor,
            lineHeight: '4.0rem',
            minWidth: 100,
        },
        label: {
            color: muiTheme.luno.colors.white,
        },
    };
    return (
        <RoundedButton
            label={label}
            labelStyle={merge(styles.label, labelStyle)}
            style={merge(styles.button, style)}
            {...other}
        />
    );
};

PrimaryRoundedButton.propTypes = {
    label: PropTypes.string.isRequired,
    labelStyle: PropTypes.object,
    style: PropTypes.object,
}

PrimaryRoundedButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default PrimaryRoundedButton;

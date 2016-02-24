import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

const TeamJoinButton = ({ dispatch, isMember, team }, { muiTheme }) => {
    function handleTouchTap() {}
    const styles = {
        button: {
            backgroundColor: muiTheme.luno.tintColor,
            borderRadius: 100,
            marginRight: 10,
            minWidth: 15,
        },
        label: {
            fontSize: '1.1rem',
            fontWeight: muiTheme.luno.fontWeights.black,
            padding: '0 20px',
            textTransform: 'uppercase',
            color: muiTheme.baseTheme.palette.alternateTextColor,
        },
    };
    const label = isMember ? t('Joined') : t('Join')
    return (
        <FlatButton
            label={label}
            labelStyle={styles.label}
            onTouchTap={handleTouchTap}
            style={styles.button}
        />
    );
};

TeamJoinButton.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isMember: PropTypes.bool,
    team: InternalPropTypes.TeamV1,
};

TeamJoinButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default TeamJoinButton;

import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import LightBulbIcon from './LightBulbIcon';
import RoundedButton from './RoundedButton';

const AddKnowledgeButton = ({ onTouchTap }, { muiTheme }) => {
    const styles = {
        button: {
            marginRight: 12,
            whiteSpace: 'nowrap',
        },
        icon: {
            margin: 0,
        },
    };

    const icon = (
        <LightBulbIcon
            height={30}
            stroke={muiTheme.luno.tintColor}
            style={styles.icon}
            width={30}
        />
    );
    return (
        <RoundedButton
            icon={icon}
            label={t('Add Knowledge')}
            labelStyle={{padding: '0 14px 0 0'}}
            onTouchTap={onTouchTap}
            style={styles.button}
        />
    );
};

AddKnowledgeButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired,
};

AddKnowledgeButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default AddKnowledgeButton;

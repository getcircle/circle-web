import React, { PropTypes } from 'react';

import { List, SelectableContainerEnhance } from 'material-ui';

import InternalPropTypes from './InternalPropTypes';

export const SelectableList = SelectableContainerEnhance(List);

const Tabs = ({ children, onRequestChange, value }, { muiTheme }) => {
    const styles = {
        root: {
            display: 'flex',
            paddingBottom: 0,
            paddingTop: 0,
        },
        selectedItemStyle: {
            color: muiTheme.luno.tintColor,
        },
    };
    return (
        <SelectableList
            children={children}
            selectedItemStyle={styles.selectedItemStyle}
            style={styles.root}
            valueLink={{value, requestChange: onRequestChange}}
        />
    );
};

Tabs.propTypes = {
    children: PropTypes.node,
    onRequestChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.any,
};

Tabs.contextTypes = {
    history: InternalPropTypes.history,
    muiTheme: PropTypes.object.isRequired,
};

export default Tabs;

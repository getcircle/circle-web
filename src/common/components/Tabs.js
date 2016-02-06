import React, { PropTypes } from 'react';

import { List, SelectableContainerEnhance } from 'material-ui';

export const SelectableList = SelectableContainerEnhance(List);

const Tabs = ({ children, value }, { muiTheme }) => {
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
            valueLink={{value}}
        />
    );
};

Tabs.propTypes = {
    children: PropTypes.node,
    value: React.PropTypes.any,
};

Tabs.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Tabs;

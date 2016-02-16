import React, { PropTypes } from 'react';

import { ListItem } from 'material-ui';

const Tab = ({ label, style, ...other }, { muiTheme }) => {
    return (
        <ListItem
            primaryText={label}
            style={{...muiTheme.luno.tabs.tab, ...style}}
            {...other}
        />
    );
};

// SelectableList will only operate on components with `displayName` set to
// `ListItem`
Tab.displayName = 'ListItem';
Tab.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
};
Tab.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
Tab.defaultProps = {
    nestedItems: [],
};

export default Tab;

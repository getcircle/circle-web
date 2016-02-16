import React, { PropTypes } from 'react';

import { ListItem } from 'material-ui';

const Tab = ({ label, style, ...other }) => {
    const styles = {
        item: {
            alignItems: 'center',
            display: 'flex',
            textTransform: 'uppercase',
            fontSize: '11px',
            lineHeight: '13px',
            height: '64px',
        },
    };
    return (
        <ListItem
            primaryText={label}
            style={{...styles.item, ...style}}
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
Tab.defaultProps = {
    nestedItems: [],
};

export default Tab;

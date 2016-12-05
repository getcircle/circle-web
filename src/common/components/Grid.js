import React, { PropTypes } from 'react';

import { List } from 'material-ui';

const Grid = ({ children }) => {
    return (
        <List className="row">
            {children}
        </List>
    );
};

Grid.propTypes = {
    children: PropTypes.node,
};

export default Grid;

import React, { PropTypes } from 'react';
import Infinite from 'react-infinite';

import { List } from 'material-ui';

const InfiniteGrid = ({ children, elementHeight, onLoadMore }) => {
    //smoothScrollingWrapperClassName="row"
    return (
        <List>
            <Infinite
                elementHeight={elementHeight}
                infiniteLoadBeginEdgeOffset={20}
                onInfiniteLoad={onLoadMore}
                useWindowAsScrollContainer={true}
            >
                {children}
            </Infinite>
        </List>
    );
};

InfiniteGrid.propTypes = {
    children: PropTypes.node,
    elementHeight: PropTypes.number.isRequired,
    onLoadMore: PropTypes.func.isRequired,
};

export default InfiniteGrid;

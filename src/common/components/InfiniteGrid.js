import React, { PropTypes } from 'react';
import Infinite from 'react-infinite';

import { List } from 'material-ui';

const InfiniteGrid = ({ children, elementHeight, onLoadMore }) => {
    //smoothScrollingWrapperClassName="row"
    return (
        <List>
            <Infinite
                elementHeight={elementHeight / 2}
                infiniteLoadBeginEdgeOffset={200}
                onInfiniteLoad={onLoadMore}
                smoothScrollingWrapperClassName="row"
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

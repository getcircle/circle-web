import React, { PropTypes } from 'react';
import Infinite from 'react-infinite';

import { List } from 'material-ui';

const InfiniteGrid = ({ children, elementHeight, loading, onLoadMore }) => {
    return (
        <List>
            <Infinite
                elementHeight={elementHeight / 2}
                infiniteLoadBeginEdgeOffset={200}
                isInfiniteLoading={loading}
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
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func.isRequired,
};

InfiniteGrid.defaultProps = {
    loading: false,
};

export default InfiniteGrid;

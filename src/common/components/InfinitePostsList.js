import React, { PropTypes } from 'react';

import InfiniteGrid from './InfiniteGrid';
import DetailListItemPost from './DetailListItemPost';

const InfinitePostsList = ({ ItemComponent, posts, ...other }) => {
    const items = posts.map((p, i) => {
        return (
            <ItemComponent
                className="col-xs-12"
                key={`detail-list-item-post-${i}`}
                post={p}
            />
        );
    });
    return <InfiniteGrid children={items} {...other} />;
};

InfinitePostsList.propTypes = {
    ItemComponent: PropTypes.func,
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    posts: PropTypes.array.isRequired,
};

InfinitePostsList.defaultProps = {
    ItemComponent: DetailListItemPost,
};

export default InfinitePostsList;

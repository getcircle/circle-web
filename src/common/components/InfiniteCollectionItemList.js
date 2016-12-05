import React, { PropTypes } from 'react';

import DetailListItemCollection from './DetailListItemCollection';
import InfiniteGrid from './InfiniteGrid';

const InfiniteCollectionItemList = ({ ItemComponent, MenuComponent, onMenuChoice, items, ...other }) => {
    const elements = items.map((item, index) => {
        return (
            <ItemComponent
                MenuComponent={MenuComponent}
                className="col-xs-12 no-padding"
                item={item}
                key={`detail-list-item-collection-item-${index}`}
                onMenuChoice={onMenuChoice}
            />
        );
    });
    return <InfiniteGrid children={elements} {...other} />;
};

InfiniteCollectionItemList.propTypes = {
    ItemComponent: PropTypes.func,
    MenuComponent: PropTypes.func,
    hasMore: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onMenuChoice: PropTypes.func,
};

InfiniteCollectionItemList.defaultProps = {
    ItemComponent: DetailListItemCollection,
};

export default InfiniteCollectionItemList;

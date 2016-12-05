import React, { Component, PropTypes } from 'react';

import { ListItem } from 'material-ui';

import InfiniteGrid from './InfiniteGrid';

class ExploreItem extends Component {

    handleTouchTap = () => {
        const { item, onSelectItem } = this.props;
        onSelectItem(item);
    }

    render() {
        const { item: { item }, ...other } = this.props;
        return (
            <div {...other}>
                <ListItem onTouchTap={this.handleTouchTap} {...item} />
            </div>
        );
    }
}

ExploreItem.propTypes = {
    item: PropTypes.shape({
        item: PropTypes.object,
        payload: PropTypes.any,
    }).isRequired,
    onSelectItem: PropTypes.func,
};

ExploreItem.defaultProps = {
    onSelectItem: () => {},
};

const ExploreList = ({ items, factory, onSelectItem, ...other }) => {
    const elements = [];
    for (let index in items) {
        const item = items[index];
        const result = factory(item);
        const element = (
            <ExploreItem
                className="col-xs-12"
                item={result}
                key={`explore-item-${index}`}
                onSelectItem={onSelectItem}
            />
        );
        elements.push(element);
    }
    return <InfiniteGrid children={elements} {...other} />;
};

ExploreList.propTypes = {
    factory: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func,
};

export { ExploreItem };
export default ExploreList;

import { merge } from 'lodash';
import React, { Component, PropTypes } from 'react';

import { ListItem } from 'material-ui';

import { createResult } from './factories';

import InfiniteGrid from '../InfiniteGrid';

class SearchResultItem extends Component {

    handleTouchTap = () => {
        const { index, item, onSelectItem } = this.props;
        if (typeof onSelectItem === 'function') {
            onSelectItem(item, index);
        }
    }

    render() {
        const { className, item: { item }, onSelectItem, ...other } = this.props;
        const props = merge(item, other);
        return (
            <div className={className}>
                <ListItem className="search-results" onTouchTap={this.handleTouchTap} {...props} />
            </div>
        );
    }
}

SearchResultItem.propTypes = {
    className: PropTypes.string,
    index: PropTypes.number,
    item: PropTypes.shape({
        item: PropTypes.object,
        type: PropTypes.string.isRequired,
        payload: PropTypes.any,
    }).isRequired,
    onSelectItem: PropTypes.func,
};

const SearchResultsList = ({ onSelectItem, results, ...other }, { muiTheme }) => {
    const items = [];
    const theme = muiTheme.luno.searchResults;
    for (let index in results) {
        const result = results[index];
        const searchResult = createResult(result, theme);
        if (searchResult) {
            const item = (
                <SearchResultItem
                    className="col-xs-12"
                    index={index}
                    item={searchResult}
                    key={`search-result-${index}`}
                    onSelectItem={onSelectItem}
                />
            );
            items.push(item);
        }
    }
    return <InfiniteGrid children={items} {...other} />;
};

SearchResultsList.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    results: PropTypes.array.isRequired,
};

SearchResultsList.defaultProps = {
    onSelectItem: () => {},
};

SearchResultsList.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { SearchResultItem };
export default SearchResultsList;

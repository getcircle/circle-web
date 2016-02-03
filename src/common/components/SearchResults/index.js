import React, { PropTypes } from 'react';

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import CSSComponent from '../CSSComponent';

import * as itemFactory from './factories';

/**
 * Given an array of search results, render them in a list.
 */
class SearchResults extends CSSComponent {

    static propTypes = {
        history: PropTypes.object,
        results: PropTypes.array.isRequired,
    }

    render() {
        const {results, history, ...other} = this.props;
        const items = [<Divider key="search-result-divider-top" />];
        for (let index in results) {
            const result = results[index];
            const item = itemFactory.getResult(result, index, history);
            if (item) {
                items.push(<ListItem key={`search-result-${index}`} {...item} />);
                items.push(<Divider key={`search-result-divider-${index}`} />);
            }
        }
        items.push(<Divider key="search-result-divider-bottom" />);
        return <List children={items} {...other} />;
    }
}

export default SearchResults;

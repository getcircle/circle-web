import React, { PropTypes } from 'react';
import mui from 'material-ui';

import CSSComponent from './CSSComponent';

const {
    ListDivider,
    List,
    ListItem,
} = mui;

class QuickSearchList extends CSSComponent {

    static propTypes = {
        highlightedIndex: PropTypes.number,
        itemStyle: PropTypes.object,
        results: PropTypes.array,
        style: PropTypes.object,
    }

    shouldComponentUpdate(nextProps, nextState) {
        const thereAreResults = (nextProps.results !== undefined && nextProps.results !== null);
        const resultsChanged = (nextProps.results !== this.props.results);
        const highlightedResultChanged = (nextProps.highlightedIndex !== this.props.highlightedIndex);
        return thereAreResults && (resultsChanged || highlightedResultChanged);
    }

    renderResult(result, index, highlighted) {
        let style = {};
        if (highlighted) {
            style = {
                backgroundColor: '#e6e6e6',
            };
        }
        return (
            <div
                key={`item-${index}`}
            >
                <ListItem
                    {...result}
                    style={{...this.props.itemStyle, ...style}}
                />
                <ListDivider />
            </div>
        );
    }

    render() {
        const {
            highlightedIndex,
            results,
            style,
        } = this.props;

        let renderedResults = []
        if (results) {
            results.forEach((result, index) => {
                renderedResults.push(this.renderResult(result, index, index === highlightedIndex));
            });
        }

        return (
            <List
                style={style}
            >
                {renderedResults}
            </List>
        );
    }
}

export default QuickSearchList;

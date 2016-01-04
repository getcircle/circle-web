import React, { PropTypes } from 'react';
import mui from 'material-ui';

import CSSComponent from './CSSComponent';

const {
    ListDivider,
    List,
    ListItem,
} = mui;

class TypeaheadResultsList extends CSSComponent {

    static propTypes = {
        highlightedIndex: PropTypes.number,
        itemStyle: PropTypes.object,
        results: PropTypes.array,
        style: PropTypes.object,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.results !== undefined && nextProps.results !== this.props.results) || nextProps.highlightedIndex !== this.props.highlightedIndex;
    }

    renderResult(result, highlighted) {
        let style = {};
        if (highlighted) {
            style = {
                backgroundColor: '#e6e6e6',
            };
        }
        return (
            <div>
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
                renderedResults.push(this.renderResult(result, index === highlightedIndex));
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

export default TypeaheadResultsList;

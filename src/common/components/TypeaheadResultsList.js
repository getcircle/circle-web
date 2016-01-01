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
        results: PropTypes.array,
        style: PropTypes.object,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.results !== undefined && nextProps.results !== this.props.results
    }

    renderResult(result) {
        return (
            <div>
                <ListItem
                    {...result}
                />
                <ListDivider />
            </div>
        );
    }

    render() {
        const {
            results,
            style,
        } = this.props;

        let renderedResults = []
        if (results) {
            results.forEach((result) => {
                renderedResults.push(this.renderResult(result));
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

import React, { PropTypes } from 'react';
import mui from 'material-ui';

import CSSComponent from './CSSComponent';

const {
    List,
    ListItem,
    Paper,
} = mui;

class TypeaheadResults extends CSSComponent {

    static propTypes = {
        results: PropTypes.array,
        style: PropTypes.object,
    }

    static defaultProps = {
        results: [],
    }

    renderResult(result) {
        return (
            <ListItem
                {...result}
            />
        )
    }

    render() {
        const {
            style,
            results,
        } = this.props;

        let renderedResults = []
        results.forEach((result) => {
            renderedResults.push(this.renderResult(result));
        });

        return (
            <div>
                <Paper
                    style={style}
                >
                    <List>
                        {renderedResults}
                    </List>
                </Paper>
            </div>
        );
    }
}

export default TypeaheadResults;

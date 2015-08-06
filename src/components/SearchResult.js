'use strict';

import mui from 'material-ui';
import React from 'react';

const { List } = mui;

class SearchResult extends React.Component {

    render() {
        return (
            <List>
                {this.props.children}
            </List>
        );
    }
}

export default SearchResult;

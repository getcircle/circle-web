'use strict';

import React from 'react';

class SearchResult extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default SearchResult;

'use strict';

import React from 'react';

class SearchResultsContainer extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default SearchResultsContainer;

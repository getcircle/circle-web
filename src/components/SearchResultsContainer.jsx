'use strict';

import React from 'react';

class SearchResultsContainer extends React.Component {

    render() {
        return (
            <div className="col-xs-8">
                {this.props.children}
            </div>
        );
    }
}

export default SearchResultsContainer;

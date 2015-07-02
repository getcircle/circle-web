'use strict';

import React from 'react';

class SearchResult extends React.Component {

    render() {
        return (
            <div className="row">
                {this.props.children}
            </div>
        );
    }
}

export default SearchResult;

'use strict';

import React from 'react';

class SearchResultHeader extends React.Component {

    // TODO add whatever icon we want to use
    static propTypes = {
        title: React.PropTypes.string,
    }

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
            </div>
        );
    }
}

export default SearchResultHeader;

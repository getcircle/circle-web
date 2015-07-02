'use strict';

import React from 'react';

class SearchResultHeader extends React.Component {

    // TODO add whatever icon we want to use
    static propTypes = {
        title: React.PropTypes.string,
    }

    styles = {
        title: {
            textAlign: 'left',
        },
    }

    render() {
        return (
            <div>
                <h2 style={this.styles.title}>{this.props.title}</h2>
            </div>
        );
    }
}

export default SearchResultHeader;

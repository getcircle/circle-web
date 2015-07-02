'use strict';

import React from 'react';

class TagSearchResult extends React.Component {

    static propTypes = {
        tag: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    render() {
        const tag = this.props.tag;
        return (
            <div className="row">
                <div className="col-xs" style={this.styles.detailsContainer}>
                    <span>{tag.name}</span>
                </div>
            </div>
        );
    }
}

export default TagSearchResult;

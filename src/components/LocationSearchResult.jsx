'use strict';

import mui from 'material-ui';
import React from 'react';

const {Avatar} = mui;

class LocationSearchResult extends React.Component {

    static propTypes = {
        location: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    render() {
        const location = this.props.location;
        return (
            <div className="row">
                <div classNmae="col-xs-1">
                    <Avatar src={location.image_url} />
                </div>
                <div className="col-xs" style={this.styles.detailsContainer}>
                    <span>{location.name}</span>
                </div>
            </div>
        );
    }
}

export default LocationSearchResult;

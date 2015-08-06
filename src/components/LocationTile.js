'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

const {
    Card,
    CardMedia,
    CardTitle,
} = mui;

@decorate(Navigation)
class LocationTile extends React.Component {

    static propTypes = {
        location: React.PropTypes.object.isRequired,
    }

    styles = {
        card: {
            cursor: 'pointer',
        },
    }

    _handleOnTouchTap(location) {
        this.transitionTo(`/location/${location.id}`);
    }

    render() {
        const { location } = this.props;
        return (
            <Card style={this.styles.card} onTouchTap={this._handleOnTouchTap.bind(this, location)}>
                <CardMedia overlay={<CardTitle title={location.name} />}>
                    <img className="location-tile__img" src={location.image_url} />
                </CardMedia>
            </Card>
        );
    }

}

export default LocationTile;

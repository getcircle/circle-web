'use strict';

import { decorate } from 'react-mixin';
import { GoogleMaps, Marker } from 'react-google-maps';
import { Navigation } from 'react-router';
import React from 'react';

import InfiniteCardGrid from '../components/InfiniteCardGrid';
import LocationTile from './LocationTile';

@decorate(Navigation)
class LocationsOverview extends React.Component {

    static propTypes = {
        locations: React.PropTypes.array.isRequired,
    }

    styles = {
        gridContainer: {
            paddingBottom: 50,
        },
    }

    _routeToLocation(location) {
        this.transitionTo(`/location/${location.id}`);
    }

    _renderLocations() {
        return (
            <div style={this.styles.gridContainer}>
                <InfiniteCardGrid
                    objects={this.props.locations}
                    loading={false}
                    ComponentClass={LocationTile}
                    componentAttributeName="location"
                />
            </div>
        );
    }

    _renderMap() {
        const containerProps = {
            style: {
                width: '100%',
                height: 600,
            },
        };
        const markers = this.props.locations.map((location, index) => {
            const { address } = location;
            return (
                <Marker
                    position={{
                        lat: parseFloat(address.latitude),
                        lng: parseFloat(address.longitude),
                    }}
                    key={index}
                    animation={2}
                    onClick={this._routeToLocation.bind(this, location)}
                />
            );
        });
        return (
            // TODO should have a way to center based on the markers
            <GoogleMaps
                containerProps={containerProps}
                googleMapsApi={window.google.maps}
                zoom={2}
                center={{lat: 0, lng: 0}}
            >
                {markers}
            </GoogleMaps>
        );
    }

    render() {
        return (
            <div>
                {this._renderLocations()}
                {this._renderMap()}
            </div>
        );
    }

}

export default LocationsOverview;

'use strict';

import React from 'react';

class EmbeddedGoogleMap extends React.Component {

    apiKey = 'AIzaSyBQVQT7k1w8m-qEkBY7hsg5vQERN1R7zx8'

    static propTypes = {
        location: React.PropTypes.object.isRequired,
    }

    _getGoogleMapsEndpoint() {
        const { address } = this.props.location;
        const googleAddress = [address.address_1, address.city, address.region, address.country_code].join(',');
        const escapedAddress = googleAddress.split(' ').join('+');
        return `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${escapedAddress}&zoom=18`;
    }

    render() {
        let {
            location,
            ...other,
        } = this.props;
        return <iframe {...other} src={this._getGoogleMapsEndpoint()} />;
    }
}

export default EmbeddedGoogleMap;

import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class EmbeddedGoogleMap extends PureComponent {

    static propTypes = {
        office: PropTypes.object.isRequired,
    }

    apiKey = 'AIzaSyA_ooSzt99omg9hWAugqIZnAyX8axkjrlk'

    getGoogleMapsEndpoint(office) {
        const googleAddress = [
            office.address_1,
            office.city,
            office.region,
            office.country_code,
        ].join(',');
        const escapedAddress = googleAddress.split(' ').join('+');
        return `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${escapedAddress}&zoom=18`;
    }

    render() {
        let {
            office,
            ...other,
        } = this.props;
        return <iframe {...other} src={this.getGoogleMapsEndpoint(office)} />;
    }
}

export default EmbeddedGoogleMap;

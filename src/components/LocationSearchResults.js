import mui from 'material-ui';
import React from 'react';

import t from '../utils/gettext';

import LocationSearchResult from './LocationSearchResult';

const { List } = mui;

class LocationSearchResults extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        locations: React.PropTypes.array.isRequired,
    }

    _renderLocationResults() {
        return this.props.locations.map((location, index) => {
            return <LocationSearchResult key={index} location={location} flux={this.props.flux} />;
        });
    }

    render() {
        return (
            <List subheader={t('Locations')}>
                {this._renderLocationResults()}
            </List>
        );
    }
}

export default LocationSearchResults;

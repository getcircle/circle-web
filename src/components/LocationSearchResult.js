import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import bindThis from '../utils/bindThis';

import TextFallbackAvatar from './TextFallbackAvatar';

const { ListItem } = mui;

@decorate(Navigation)
class LocationSearchResult extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    @bindThis
    _handleTouchTap() {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/location/${this.props.location.id}`);
    }

    render() {
        const location = this.props.location;
        return (
            <ListItem
                leftAvatar={<TextFallbackAvatar src={location.image_url} fallbackText={location.name[0]} />}
                onTouchTap={this._handleTouchTap}
            >
                {location.name}
            </ListItem>
        );
    }
}

export default LocationSearchResult;

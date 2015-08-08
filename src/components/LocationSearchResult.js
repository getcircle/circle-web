import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import t from '../utils/gettext';
import officeIcon from '../images/icons/office_icon.svg';

const { 
    Avatar,
    ListItem,
} = mui;

@decorate(Navigation)
class LocationSearchResult extends React.Component {

    static propTypes = {
        location: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    _handleTouchTap = this._handleTouchTap.bind(this)
    _handleTouchTap() {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/location/${this.props.location.id}`);
    }

    render() {
        const { location } = this.props;
        return (
            <ListItem
                leftAvatar={<Avatar src={officeIcon} />}
                onTouchTap={this._handleTouchTap}
                primaryText={location.name}
                secondaryText={t(`${location.profile_count} people`)}
            />
        );
    }
}

export default LocationSearchResult;

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import { routeToLocation } from '../utils/routes';
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
        onClick: React.PropTypes.func,
    }

    _handleTouchTap = this._handleTouchTap.bind(this)
    _handleTouchTap() {
        if (this.props.onClick) {
            this.props.onClick();
        }

        routeToLocation.apply(this, [this.props.location]);
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

import { Avatar, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';

import { routeToLocation } from '../utils/routes';
import t from '../utils/gettext';
import officeIcon from '../images/icons/office_icon.svg';

import PureComponent from './PureComponent';

class LocationSearchResult extends PureComponent {

    static propTypes = {
        location: PropTypes.object.isRequired,
        onClick: PropTypes.func,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    _handleTouchTap = this._handleTouchTap.bind(this)
    _handleTouchTap() {
        if (this.props.onClick) {
            this.props.onClick();
        }
        routeToLocation(this.context.router, this.props.location);
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

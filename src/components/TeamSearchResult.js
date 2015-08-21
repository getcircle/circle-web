import { Avatar, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';

import { routeToTeam } from '../utils/routes';
import t from '../utils/gettext';
import teamIcon from '../images/icons/group_icon.svg';

import StyleableComponent from './StyleableComponent';

class TeamSearchResult extends StyleableComponent {

    static propTypes = {
        onClick: PropTypes.func,
        team: PropTypes.object.isRequired,
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
        routeToTeam.apply(this, [this.props.team]);
    }

    render() {
        const { team } = this.props;
        return (
            <ListItem
                leftAvatar={<Avatar src={teamIcon} />}
                onTouchTap={this._handleTouchTap}
                primaryText={team.display_name}
                secondaryText={t(`${team.profile_count} members`)}
            />
        );
    }
}

export default TeamSearchResult;

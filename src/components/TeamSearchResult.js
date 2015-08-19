import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import { routeToTeam } from '../utils/routes';
import t from '../utils/gettext';
import teamIcon from '../images/icons/group_icon.svg';

const {
    Avatar,
    ListItem,
} = mui;

@decorate(Navigation)
class TeamSearchResult extends React.Component {

    static propTypes = {
        team: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
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
                primaryText={team.name}
                secondaryText={t(`${team.profile_count} members`)}
            />
        );
    }
}

export default TeamSearchResult;

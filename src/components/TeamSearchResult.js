import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import t from '../utils/gettext';
import teamIcon from '../images/icons/group_icon.svg';

const {
    Avatar,
    ListItem,
} = mui;

@decorate(Navigation)
class TeamSearchResult extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        team: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    _handleTouchTap = this._handleTouchTap.bind(this)
    _handleTouchTap() {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/team/${this.props.team.id}`);
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

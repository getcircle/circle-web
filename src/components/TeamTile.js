import _ from 'lodash';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import constants from '../styles/constants';
import { getRandomColor } from '../utils/avatars';

const { Paper } = mui;

@decorate(Navigation)
class TeamTile extends React.Component {

    static propTypes = {
        team: React.PropTypes.object.isRequired,
    }

    styles = {
        name: {
            color: constants.colors.lightText,
            padding: 20,
        },
        paper: {
            width: 200,
            height: 200,
            cursor: 'pointer',
        },
    }

    _handleTouchTap(team) {
        this.transitionTo(`/team/${team.id}`);
    }

    render() {
        const { team } = this.props;
        const paperStyle = _.assign(this.styles.paper, {backgroundColor: getRandomColor(team.name)});
        return (
            <div>
                <Paper
                    className="profile-tile content--center"
                    style={paperStyle}
                    circle={true}
                    onTouchTap={this._handleTouchTap.bind(this, team)}
                >
                    <p style={this.styles.name}>{team.name}</p>
                </Paper>
            </div>
        );
    }
}

export default TeamTile;

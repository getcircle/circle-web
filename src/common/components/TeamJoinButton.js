import { FlatButton } from 'material-ui';
import React, { Component, PropTypes } from 'react';

import Colors from '../styles/Colors';
import { joinTeam, leaveTeam } from '../actions/teams';
import { services } from 'protobufs';
import t from '../utils/gettext';

import Hoverable from './Hoverable';
import InternalPropTypes from './InternalPropTypes';

class TeamJoinButton extends Component {

    state = {
        justJoined: false,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.hover && !nextProps.hover) {
            this.setState({justJoined: false});
        }
    }

    handleTouchTap = () => {
        const { currentUserMember, dispatch, team } = this.props;
        if (currentUserMember) {
            dispatch(leaveTeam(team.id, currentUserMember.id));
        } else {
            this.setState({justJoined: true})
            dispatch(joinTeam(team.id));
        }
    }

    render() {
        const {
            hover,
            currentUserMember,
        } = this.props;
        const { muiTheme } = this.context;
        const { justJoined } = this.state;
        const styles = {
            button: {
                backgroundColor: currentUserMember ? 'transparent' : muiTheme.luno.tintColor,
                borderColor: currentUserMember ? Colors.white : muiTheme.luno.tintColor,
                borderRadius: 100,
                borderStyle: 'solid',
                borderWidth: 1,
                marginRight: 10,
                minWidth: 15,
            },
            label: {
                fontSize: '1.1rem',
                fontWeight: muiTheme.luno.fontWeights.black,
                padding: '0 20px',
                textTransform: 'uppercase',
                color: muiTheme.baseTheme.palette.alternateTextColor,
            },
        };
        let label;
        if (currentUserMember) {
            if (hover && !justJoined) {
                label = t('Leave');
            } else {
                label = t('Joined');
            }
        } else {
            label = t('Join');
        }
        return (
            <FlatButton
                label={label}
                labelStyle={styles.label}
                onTouchTap={this.handleTouchTap}
                style={styles.button}
            />
        );
    }
};

TeamJoinButton.propTypes = {
    currentUserMember: PropTypes.instanceOf(services.team.containers.TeamMemberV1),
    dispatch: PropTypes.func.isRequired,
    hover: PropTypes.bool.isRequired,
    team: InternalPropTypes.TeamV1,
};

TeamJoinButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Hoverable(TeamJoinButton);

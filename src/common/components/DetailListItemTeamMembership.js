import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import t from '../utils/gettext';
import { routeToTeam } from '../utils/routes';
import Colors from '../styles/Colors';

class DetailListItemTeamMembership extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.member.id !== nextProps.member.id;
    }

    handleTouchTap = () => {
        routeToTeam(this.props.member.team);
    }

    render() {
        const { member: { role, team }, ...other } = this.props;
        const styles = {
            innerDivStyle: {
                paddingLeft: 10,
            },
            primaryText: {
                fontSize: '16px',
                lineHeight: '19px',
            },
            secondaryText: {
                fontSize: '13px',
                color: Colors.lightBlack,
            },
        };

        let primaryText;
        if (role === services.team.containers.TeamMemberV1.RoleV1.COORDINATOR) {
            primaryText = (
                <span>
                    <span style={styles.primaryText}>{team.name}</span><span style={styles.secondaryText}>{` (${t('Coordinator')})`}</span>
                </span>
            );
        } else {
            primaryText = <span style={styles.primaryText}>{team.name}</span>;
        }

        return (
            <div {...other}>
                <ListItem
                    innerDivStyle={styles.innerDivStyle}
                    onTouchTap={this.handleTouchTap}
                    primaryText={primaryText}
                    secondaryText={<div><span style={styles.secondaryText}>{`${team.total_members} ${t('People')}`}</span></div>}
                />
            </div>
        );
    }
}

DetailListItemTeamMembership.propTypes = {
    member: PropTypes.instanceOf(services.team.containers.TeamMemberV1),
};

export default DetailListItemTeamMembership;

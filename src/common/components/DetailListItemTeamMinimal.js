import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import t from '../utils/gettext';
import { routeToTeam } from '../utils/routes';
import Colors from '../styles/Colors';

class DetailListItemTeamMinimal extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.team.id !== nextProps.team.id;
    }

    handleTouchTap = () => {
        routeToTeam(this.props.team);
    }

    render() {
        const { team, ...other } = this.props;
        const styles = {
            avatar: {
                height: 50,
                width: 50,
                marginRight: 16,
            },
            innerDivStyle: {
                paddingLeft: 86,
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
        if (team.permissions.can_edit) {
            primaryText = (
                <span>
                    <span style={styles.primaryText}>{team.name}</span><span style={styles.secondaryText}>{`(${t('Coordinator')})`}</span>
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
                    secondaryText={<span style={styles.secondaryText}>{`${team.total_members} ${t('People')}`}</span>}
                />
            </div>
        );
    }
}

DetailListItemTeamMinimal.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};

export default DetailListItemTeamMinimal;

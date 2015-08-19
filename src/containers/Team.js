import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Immutable from 'immutable';
import React from 'react';
import { services } from 'protobufs';

import { loadExtendedTeam, loadTeamMembers } from '../actions/teams';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent'; 
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.extendedTeamsSelector,
        selectors.routerSelector,
        selectors.teamMembersSelector,
    ],
    (extendedTeamsState, routerState, membersState) => {
        return {
            loading: extendedTeamsState.get('loading') || membersState.get('loading'),
            extendedTeam: extendedTeamsState.getIn(['objects', routerState.params.teamId]),
            members: membersState.getIn(['members', routerState.params.teamId]),
        }
    }
);

@connect(selector)
class Team extends React.Component {

    static propTypes = {
        extendedTeam: React.PropTypes.object,
        members: React.PropTypes.arrayOf(
            React.PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    _loadTeam(props) {
        props.dispatch(loadExtendedTeam(props.params.teamId));
        props.dispatch(loadTeamMembers(props.params.teamId));
    }

    componentWillMount() {
        this._loadTeam(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            this._loadTeam(nextProps);
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _renderTeam() {
        const {
            extendedTeam,
            members,
        } = this.props;
        if (extendedTeam && members) {
            return <TeamDetail extendedTeam={extendedTeam} members={members} />;
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this._renderTeam()}
            </Container>
        );
    }

}

export default Team;

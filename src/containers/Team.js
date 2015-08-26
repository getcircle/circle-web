import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { loadExtendedTeam, loadTeamMembers, retrieveExtendedTeam, retrieveTeamMembers } from '../actions/teams';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent';
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.extendedTeamsSelector,
        selectors.routerParametersSelector,
        selectors.teamMembersSelector,
    ],
    (cacheState, extendedTeamsState, parametersSelector, membersState) => {
        let extendedTeam, members;
        const teamId = parametersSelector.teamId;
        const cache = cacheState.toJS();
        if (extendedTeamsState.get('ids').has(teamId)) {
            extendedTeam = retrieveExtendedTeam(teamId, cache);
        }
        if (membersState.has(teamId) && !membersState.get(teamId).get('loading')) {
            const ids = membersState.get(teamId).get('ids').toJS();
            members = retrieveTeamMembers(ids, cache);
        }
        return {extendedTeam: extendedTeam, members: members};
    }
);

@connect(selector)
class Team extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedTeam: PropTypes.shape({
            reportingDetails: PropTypes.object.isRequired,
            team: PropTypes.object.isRequired,
        }),
        members: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        params: PropTypes.shape({
            teamId: PropTypes.string,
        }),
    }

    componentWillMount() {
        this._loadTeam(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            this._loadTeam(nextProps);
        }
    }

    _loadTeam(props) {
        props.dispatch(loadExtendedTeam(props.params.teamId));
        props.dispatch(loadTeamMembers(props.params.teamId));
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

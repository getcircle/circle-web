import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import {
    loadExtendedTeam,
    loadTeamMembers,
    updateTeam,
} from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveExtendedTeam, retrieveProfiles } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.extendedTeamsSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
        selectors.teamMembersSelector,
    ],
    (cacheState, extendedTeamsState, responsiveState, parametersSelector, membersState) => {
        let extendedTeam, members, membersNextRequest;
        const teamId = parametersSelector.teamId;
        const cache = cacheState.toJS();
        if (extendedTeamsState.get('ids').has(teamId)) {
            extendedTeam = retrieveExtendedTeam(teamId, cache);
        }
        if (membersState.has(teamId)) {
            const ids = membersState.get(teamId).get('ids').toJS();
            members = retrieveProfiles(ids, cache);
            membersNextRequest = membersState.get(teamId).get('nextRequest');
        }
        return {
            extendedTeam: extendedTeam,
            largerDevice: responsiveState.get('largerDevice'),
            members: members,
            membersNextRequest: membersNextRequest,
        };
    }
);

@connect(selector)
class Team extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedTeam: PropTypes.shape({
            reportingDetails: PropTypes.object.isRequired,
            team: PropTypes.object.isRequired,
        }),
        largerDevice: PropTypes.bool.isRequired,
        members: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1),
        ),
        membersNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        params: PropTypes.shape({
            teamId: PropTypes.string,
        }),
    }

    componentWillMount() {
        this.loadTeam(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            this.loadTeam(nextProps);
        }
    }

    loadTeam(props) {
        props.dispatch(loadExtendedTeam(props.params.teamId));
        this.loadTeamMembers(props);
        resetScroll();
    }

    loadTeamMembers(props) {
        props.dispatch(loadTeamMembers(props.params.teamId, props.membersNextRequest));
    }

    onUpdateTeam(team) {
        this.props.dispatch(updateTeam(team))
    }

    renderTeam() {
        const {
            extendedTeam,
            largerDevice,
            members,
        } = this.props;
        if (extendedTeam) {
            return (
                <TeamDetail
                    extendedTeam={extendedTeam}
                    largerDevice={largerDevice}
                    members={members}
                    membersLoadMore={() => this.loadTeamMembers(this.props)}
                    onUpdateTeamCallback={this.onUpdateTeam.bind(this)}
                />
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this.renderTeam()}
            </Container>
        );
    }

}

export default Team;

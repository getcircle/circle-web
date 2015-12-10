import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import { loadExtendedTeam, loadTeamMembers, updateTeam } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveExtendedTeam, retrieveProfiles } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.extendedTeamsSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
        selectors.teamMembersSelector,
    ],
    (authenticationState, cacheState, extendedTeamsState, responsiveState, parametersSelector, membersState) => {
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
            authenticatedProfile: authenticationState.get('profile'),
            members: members,
            membersNextRequest: membersNextRequest,
        };
    }
);

function fetchTeam(dispatch, params, membersNextRequest) {
    return dispatch(loadExtendedTeam(params.teamId));
}

function fetchTeamMembers(dispatch, params, membersNextRequest) {
    return dispatch(loadTeamMembers(params.teamId, membersNextRequest));
}

function fetchData(getState, dispatch, location, params) {
    return Promise.all([
        fetchTeam(dispatch, params),
        fetchTeamMembers(dispatch, params),
    ]);
}

@connectData(fetchData)
@connect(selector)
class Team extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
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

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
        };
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            resetScroll();
            this.loadTeam(nextProps);
        }
    }

    loadTeam(props) {
        fetchTeam(props.dispatch, props.params);
        fetchTeamMembers(props.dispatch, props.params, props.membersNextRequest);
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
                    membersLoadMore={() => fetchTeamMembers.bind(
                        this.props.dispatch,
                        this.props.params,
                        this.props.membersNextRequest
                    )}
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

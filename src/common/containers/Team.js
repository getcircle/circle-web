import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { provideHooks } from 'redial';

import { getTeam, getCoordinators, getMembers } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { slice } from '../reducers/paginate';
import { retrieveTeam, retrieveTeamMembers } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.teamCoordinatorsSelector,
        selectors.teamMembersSelector,
    ],
    (cacheState, parametersState, coordinatorsState, membersState) => {
        let coordinators, members, membersNextRequest, membersLoading;
        const teamId = parametersState.teamId;
        const cache = cacheState.toJS();
        const team = retrieveTeam(teamId, cache);
        if (coordinatorsState.has(teamId)) {
            const ids = coordinatorsState.get(teamId).get('ids');
            if (ids.size) {
                coordinators = retrieveTeamMembers(ids.toJS(), cache);
            }
        }

        if (membersState.has(teamId)) {
            const ids = slice(membersState.get(teamId));
            if (ids.size) {
                members = retrieveTeamMembers(ids.toJS(), cache);
                membersNextRequest = membersState.get(teamId).get('nextRequest');
            }
            membersLoading = membersState.get(teamId).get('loading');
        }
        return {
            coordinators,
            members,
            membersLoading,
            membersNextRequest,
            team,
        };
    }
);

const hooks = {
    fetch: ({ dispatch, params }) => fetchTeam(dispatch, params),
    defer: ({ dispatch, params }) => {
        fetchTeamCoordinators(dispatch, params);
        fetchTeamMembers(dispatch, params);
    },
};

function fetchTeam(dispatch, params) {
    return dispatch(getTeam(params.teamId));
}

function fetchTeamCoordinators(dispatch, params) {
    return dispatch(getCoordinators(params.teamId));
}

function fetchTeamMembers(dispatch, params, membersNextRequest) {
    return dispatch(getMembers(params.teamId, membersNextRequest));
}

function loadTeam({dispatch, params}) {
    fetchTeam(dispatch, params);
    fetchTeamCoordinators(dispatch, params);
    fetchTeamMembers(dispatch, params);
}

class Team extends CSSComponent {

    static propTypes = {
        coordinators: PropTypes.array,
        dispatch: PropTypes.func.isRequired,
        members: PropTypes.array,
        membersLoading: PropTypes.bool,
        membersNextRequest: PropTypes.object,
        params: PropTypes.shape({
            slug: PropTypes.string,
            teamId: PropTypes.string.isRequired,
        }),
        team: PropTypes.instanceOf(services.team.containers.TeamV1),
    }

    static defaultProps = {
        membersLoading: false,
    }

    handleLoadMoreMembers = () => {
        const { dispatch, params: { teamId }, membersNextRequest } = this.props;
        dispatch(getMembers(teamId, membersNextRequest));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            resetScroll();
            loadTeam({dispatch: nextProps.dispatch, params: nextProps.params});
        }
    }

    render() {
        const { params: { slug }, team } = this.props;
        const title = team ? team.name : null;

        let content;
        if (team) {
            content = (
                <TeamDetail
                    onLoadMoreMembers={this.handleLoadMoreMembers}
                    slug={slug}
                    {...this.props}
                />
            );
        } else {
            content = <CenterLoadingIndicator />;
        }
        return (
            <Container title={title}>
                {content}
            </Container>
        );
    }

}

export { Team };
export default provideHooks(hooks)(connect(selector)(Team));

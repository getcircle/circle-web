import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeam, getCoordinators } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveTeam, retrieveTeamMembers } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import TeamDetail from '../components/TeamDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.teamCoordinatorsSelector,
    ],
    (cacheState, parametersState, coordinatorsState) => {
        let coordinators;
        const teamId = parametersState.teamId;
        const cache = cacheState.toJS();
        const team = retrieveTeam(teamId, cache);
        if (coordinatorsState.has(teamId)) {
            const ids = coordinatorsState.get(teamId).get('ids');
            if (ids.size) {
                coordinators = retrieveTeamMembers(ids.toJS(), cache);
            }
        }
        return {
            coordinators,
            team,
        };
    }
);

function fetchTeam(dispatch, params) {
    return dispatch(getTeam(params.teamId));
}

function fetchTeamCoordinators(dispatch, params) {
    return dispatch(getCoordinators(params.teamId));
}

//function fetchTeamMembers(dispatch, params, membersNextRequest) {
    //return dispatch(loadTeamMembers(params.teamId, membersNextRequest));
//}

function fetchData(getState, dispatch, location, params) {
    return Promise.all([
        fetchTeam(dispatch, params),
        fetchTeamCoordinators(dispatch, params),
    ]);
}

function loadTeam({dispatch, params}) {
    fetchTeam(dispatch, params);
    fetchTeamCoordinators(dispatch, params);
}

class Team extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        params: PropTypes.shape({
            slug: PropTypes.string,
            teamId: PropTypes.string.isRequired,
        }),
        team: PropTypes.instanceOf(services.team.containers.TeamV1),
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            resetScroll();
            loadTeam({dispatch: nextProps.dispatch, params: nextProps.params});
        }
    }

    render() {
        const { team } = this.props;
        const title = team ? team.name : null;

        let content;
        if (team) {
            content = <TeamDetail {...this.props} />;
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
export default connectData(fetchData)(connect(selector)(Team));

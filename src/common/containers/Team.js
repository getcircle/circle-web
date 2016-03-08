import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { provideHooks } from 'redial';

import { getCollectionsForOwner } from '../actions/collections';
import { getCollectionsForOwnerKey } from '../services/posts';
import { getPaginator } from '../services/helpers';
import { getTeam, getCoordinators, getMembers } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { slice } from '../reducers/paginate';
import {
    retrieveCollections,
    retrieveTeam,
    retrieveTeamMember,
    retrieveTeamMembers,
} from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import TeamDetail from '../components/TeamDetail';

const { TEAM } = services.post.containers.CollectionV1.OwnerTypeV1;

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.teamMembershipSelector,
        selectors.teamCoordinatorsSelector,
        selectors.teamMembersSelector,
        selectors.collectionsSelector,
        selectors.deleteTeamSelector,
    ],
    (cacheState, parametersState, teamMembershipState, coordinatorsState, membersState, collectionsState, deleteTeamState) => {
        let collections,
            collectionsCount,
            collectionsLoaded,
            collectionsLoading,
            collectionsNextRequest,
            coordinators,
            defaultCollection,
            defaultCollectionLoaded,
            members,
            membersCount,
            membersNextRequest,
            membersLoading;

        const teamId = parametersState.teamId;
        const cache = cacheState.toJS();
        const team = retrieveTeam(teamId, cache);
        const memberId = teamMembershipState.getIn([teamId, 'memberId']);
        const currentUserMember = retrieveTeamMember(memberId, cache);
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
                membersCount = membersNextRequest ? getPaginator(membersNextRequest).count : members.length;
            }
            membersLoading = membersState.get(teamId).get('loading');
        }

        const collectionsKey = getCollectionsForOwnerKey(TEAM, teamId);
        if (collectionsState.has(collectionsKey)) {
            const ids = collectionsState.get(collectionsKey).get('ids');
            if (ids.size) {
                collections = retrieveCollections(ids.toJS(), cache);
                collectionsNextRequest = collectionsState.get(collectionsKey).get('nextRequest');
                collectionsCount = collectionsNextRequest ? getPaginator(collectionsNextRequest).count : collections.length;
            }
            collectionsLoading = collectionsState.get(collectionsKey).get('loading');
            collectionsLoaded = collectionsState.get(collectionsKey).get('loaded');
        }

        const defaultCollectionKey = getCollectionsForOwnerKey(TEAM, teamId, true);
        if (collectionsState.has(defaultCollectionKey)) {
            const ids = collectionsState.get(defaultCollectionKey).get('ids');
            if (ids.size) {
                defaultCollection = retrieveCollections(ids.toJS(), cache)[0];
            }
            defaultCollectionLoaded = collectionsState.get(defaultCollectionKey).get('loaded');
        }

        return {
            collections,
            collectionsCount,
            collectionsLoaded,
            collectionsLoading,
            collectionsNextRequest,
            coordinators,
            currentUserMember,
            defaultCollection,
            defaultCollectionLoaded,
            members,
            membersCount,
            membersLoading,
            membersNextRequest,
            pendingTeamToDelete: deleteTeamState.get('pendingTeamToDelete'),
            team,
        };
    }
);

const hooks = {
    fetch: (locals) => {
        return Promise.all([
            fetchTeam(locals),
            fetchTeamCoordinators(locals),
        ]);
    },
    defer: (locals) => {
        fetchTeamMembers(locals);
        fetchCollections(locals);
        fetchDefaultCollection(locals);
    },
};

function fetchTeam({ dispatch, params: { teamId } }) {
    return dispatch(getTeam(teamId));
}

function fetchTeamCoordinators({ dispatch, params: { teamId } }) {
    return dispatch(getCoordinators(teamId));
}

function fetchTeamMembers({ dispatch, params: { teamId } }) {
    return dispatch(getMembers(teamId));
}

function fetchCollections({ dispatch, params: { teamId } }) {
    return dispatch(getCollectionsForOwner(TEAM, teamId));
}

function fetchDefaultCollection({ dispatch, params: { teamId } }) {
    return dispatch(getCollectionsForOwner(TEAM, teamId, true));
}

function loadTeam(locals) {
    fetchTeam(locals);
    fetchTeamCoordinators(locals);
    fetchTeamMembers(locals);
    fetchCollections(locals);
    fetchDefaultCollection(locals);
}

class Team extends CSSComponent {

    handleLoadMoreCollections = () => {
        const { dispatch, params: { teamId }, collectionsNextRequest } = this.props;
        dispatch(getCollectionsForOwner(TEAM, teamId, collectionsNextRequest));
    }

    handleLoadMoreMembers = () => {
        const { dispatch, params: { teamId }, membersNextRequest } = this.props;
        dispatch(getMembers(teamId, membersNextRequest));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            resetScroll();
            loadTeam(nextProps);
        }
    }

    render() {
        const {
            collectionsNextRequest,
            membersNextRequest,
            params: { slug },
            team,
        } = this.props;
        const title = team ? team.name : null;

        // TODO move the center loading indicator within team detail so we have
        // the header loaded
        let content;
        if (team) {
            content = (
                <TeamDetail
                    hasMoreCollections={!!collectionsNextRequest}
                    hasMoreMembers={!!membersNextRequest}
                    onLoadMoreCollections={this.handleLoadMoreCollections}
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

Team.propTypes = {
    collections: PropTypes.array,
    collectionsCount: PropTypes.number,
    collectionsLoaded: PropTypes.bool,
    collectionsLoading: PropTypes.bool,
    collectionsNextRequest: PropTypes.object,
    coordinators: PropTypes.array,
    defaultCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    defaultCollectionLoaded: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    members: PropTypes.array,
    membersCount: PropTypes.number,
    membersLoading: PropTypes.bool,
    membersNextRequest: PropTypes.object,
    params: PropTypes.shape({
        slug: PropTypes.string,
        teamId: PropTypes.string.isRequired,
    }),
    pendingTeamToDelete: PropTypes.instanceOf(services.team.containers.TeamV1),
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
}

Team.defaultProps = {
    collectionsCount: 0,
    collectionsLoaded: false,
    collectionsLoading: false,
    membersLoading: false,
}

export { Team };
export default provideHooks(hooks)(connect(selector)(Team));

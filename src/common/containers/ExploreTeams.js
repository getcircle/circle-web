import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import * as selectors from '../selectors';
import { provideHooks } from 'redial';

import { retrieveTeams } from '../reducers/denormalizations';
import { exploreTeams } from '../actions/explore';
import t from '../utils/gettext';

import Container from '../components/Container';
import { default as ExploreTeamsComponent } from '../components/ExploreTeams';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.exploreTeamsSelector,
    ],
    (cacheState, exploreTeamsState) => {
        let loading, teams, teamsCount, nextRequest;
        if (exploreTeamsState) {
            if (exploreTeamsState.get('ids').size) {
                const ids = exploreTeamsState.get('ids');
                teams = retrieveTeams(ids.toJS(), cacheState.toJS());
                nextRequest = exploreTeamsState.get('nextRequest');
                teamsCount = exploreTeamsState.get('count');
            }
            loading = exploreTeamsState.get('loading');
        }
        return {
            loading,
            nextRequest,
            teams,
            teamsCount,
        };
    },
);

const hooks = {
    // XXX this needs to be updated for new teams
    defer: ({ dispatch }) => dispatch(exploreTeams()),
};

class ExploreTeams extends Component {

    handleLoadMore = () => {
        const { dispatch, nextRequest } = this.props;
        dispatch(exploreTeams(nextRequest));
    }

    render() {
        const { nextRequest } = this.props;
        return (
            <Container title={t('Explore Teams')}>
                <ExploreTeamsComponent
                    hasMore={!!nextRequest}
                    onLoadMore={this.handleLoadMore}
                    {...this.props}
                />
            </Container>
        );
    }

};

ExploreTeams.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    teams: PropTypes.array,
};

export default provideHooks(hooks)(connect(selector)(ExploreTeams));

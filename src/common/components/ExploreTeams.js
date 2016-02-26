import Immutable from 'immutable';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToTeam } from '../utils/routes';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import Explore from './Explore';
import ExploreList from './ExploreList';
import { createTeamResult } from './SearchResultsList/factories';

function handleSelectItem({ payload }) {
    routeToTeam(payload);
}

const ExploreTeams = ({ hasMore, loading, onLoadMore, teams, teamsCount, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.searchResults;
    function createExploreItem(team) {
        return createTeamResult({team, highlight: Immutable.Map()}, theme);
    }

    let content;
    if (!teams) {
        content = <CenterLoadingIndicator />;
    } else {
        content = (
            <ExploreList
                factory={createExploreItem}
                hasMore={hasMore}
                items={teams}
                loading={loading}
                onLoadMore={onLoadMore}
                onSelectItem={handleSelectItem}
            />
        );
    }

    return (
        <Explore count={teamsCount} noun={t('Teams')}>
            {content}
        </Explore>
    );
};

ExploreTeams.propTypes = {
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    posts: PropTypes.array,
    postsCount: PropTypes.number,
};

ExploreTeams.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ExploreTeams;

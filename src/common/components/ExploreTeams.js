import Immutable from 'immutable';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToTeam } from '../utils/routes';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import CreateTeamForm from './CreateTeamForm';
import Explore from './Explore';
import ExploreList from './ExploreList';
import { createTeamResult } from './SearchResultsList/factories';
import RoundedButton from './RoundedButton';
import { CREATE_TEAM } from '../constants/forms';
import { showFormDialog } from '../actions/forms';

function handleSelectItem({ payload }) {
    routeToTeam(payload);
}

const EmptyState = (props, { store: { dispatch } }) => {

    const styles = {
        text: {
            fontSize: '1.6rem',
        },
        textRow: {
            padding: 30,
        },
    };

    function handleTouchTap() {
        dispatch(showFormDialog(CREATE_TEAM));
    }

    return (
        <div>
            <div className="row center-xs" style={styles.textRow}>
                <span style={styles.text}>{t('No teams have been created yet.')}</span><br />
            </div>
            <div className="row center-xs">
                <RoundedButton
                    label={t('Add A Team')}
                    onTouchTap={handleTouchTap}
                />
            </div>
            <div className="row center-xs" style={styles.textRow}>
                <span style={styles.text}>{t('Teams can be departments, functional teams, or even project groups.')}</span>
            </div>
            <CreateTeamForm />
        </div>
    );
};

EmptyState.contextTypes = {
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const ExploreTeams = ({ hasMore, loaded, loading, onLoadMore, teams, teamsCount, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.searchResults;
    function createExploreItem(team) {
        return createTeamResult({team, highlight: Immutable.Map()}, theme);
    }

    let content;
    if (!loaded && !teams) {
        content = <CenterLoadingIndicator />;
    } else if (loaded && !teams) {
        content = <EmptyState />;
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
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    teams: PropTypes.array,
    teamsCount: PropTypes.number,
};

ExploreTeams.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ExploreTeams;

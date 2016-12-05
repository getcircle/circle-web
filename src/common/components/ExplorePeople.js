import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import Explore from './Explore';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';

const ExplorePeople = ({ hasMore, loading, onLoadMore, profiles, profilesCount, ...other }, { muiTheme }) => {
    let content;
    if (!profiles) {
        content = <CenterLoadingIndicator />;
    } else {
        content = (
            <InfiniteProfilesGrid
                hasMore={hasMore}
                loading={loading}
                onLoadMore={onLoadMore}
                profiles={profiles}
            />
        );
    }

    return (
        <Explore count={profilesCount} noun={t('People')}>
            {content}
        </Explore>
    );
};

ExplorePeople.propTypes = {
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    profiles: PropTypes.array,
    profilesCount: PropTypes.number,
};

ExplorePeople.defaultProps = {
    onSelectItem: () => {},
};

ExplorePeople.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ExplorePeople;

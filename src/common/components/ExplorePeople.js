import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import DetailContent from './DetailContent';
import DetailSection from './DetailSectionV2';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';

const ExplorePeople = ({ hasMore, loading, onLoadMore, profiles, profilesCount, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
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

    const count = profilesCount ? ` (${profilesCount})` : '';
    return (
        <DetailContent>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t(`People ${count}`)}</h1>
            </section>
            <DetailSection dividerStyle={{marginBottom: 0}}>
                {content}
            </DetailSection>
        </DetailContent>
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

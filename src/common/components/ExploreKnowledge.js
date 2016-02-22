import Immutable from 'immutable';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToPost } from '../utils/routes';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import Explore from './Explore';
import ExploreList from './ExploreList';
import { createPostResult } from './SearchResultsList/factories';

function handleSelectItem({ payload }) {
    routeToPost(payload);
}


const ExploreKnowledge = ({ hasMore, loading, onLoadMore, posts, postsCount, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.searchResults;
    function createExploreItem(post) {
        return createPostResult({post, highlight: Immutable.Map()}, theme);
    }

    let content;
    if (!posts) {
        content = <CenterLoadingIndicator />;
    } else {
        content = (
            <ExploreList
                factory={createExploreItem}
                hasMore={hasMore}
                items={posts}
                loading={loading}
                onLoadMore={onLoadMore}
                onSelectItem={handleSelectItem}
            />
        );
    }

    return (
        <Explore count={postsCount} noun={t('Posts')}>
            {content}
        </Explore>
    );
};

ExploreKnowledge.propTypes = {
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    posts: PropTypes.array,
    postsCount: PropTypes.number,
};

ExploreKnowledge.defaultProps = {
    onSelectItem: () => {},
};

ExploreKnowledge.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ExploreKnowledge;

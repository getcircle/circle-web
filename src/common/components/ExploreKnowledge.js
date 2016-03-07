import Immutable from 'immutable';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToNewPost, routeToPost } from '../utils/routes';

import AddKnowledgeButton from './AddKnowledgeButton';
import CenterLoadingIndicator from './CenterLoadingIndicator';
import Explore from './Explore';
import ExploreList from './ExploreList';
import { createPostResult } from './SearchResultsList/factories';

function handleSelectItem({ payload }) {
    routeToPost(payload);
}

const EmptyState = () => {
    const styles = {
        text: {
            fontSize: '1.6rem',
        },
        textRow: {
            padding: 30,
        },
    };
    return (
        <div>
            <div className="row center-xs" style={styles.textRow}>
                <span style={styles.text}>{t('No one\'s added knowledge yet. Be the first!')}</span><br />
            </div>
            <div className="row center-xs">
                <AddKnowledgeButton onTouchTap={routeToNewPost} />
            </div>
            <div className="row center-xs" style={styles.textRow}>
                <span style={styles.text}>{t('Luno is the knowledge archive where everyone can pin and find important company info.')}</span>
            </div>
        </div>
    );
};

const ExploreKnowledge = ({ hasMore, loaded, loading, onLoadMore, posts, postsCount, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.searchResults;
    function createExploreItem(post) {
        return createPostResult({post, highlight: Immutable.Map()}, theme);
    }

    let content;
    if (!loaded && !posts) {
        content = <CenterLoadingIndicator />;
    } else if (loaded && !posts) {
        content = <EmptyState />;
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

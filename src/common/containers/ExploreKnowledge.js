import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import * as selectors from '../selectors';
import { provideHooks } from 'redial';

import { retrievePosts } from '../reducers/denormalizations';
import { explorePosts } from '../actions/explore';
import t from '../utils/gettext';

import Container from '../components/Container';
import { default as ExploreKnowledgeComponent } from '../components/ExploreKnowledge';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.explorePostsSelector,
    ],
    (cacheState, explorePostsState) => {
        let loading, posts, postsCount, nextRequest;
        if (explorePostsState) {
            if (explorePostsState.get('ids').size) {
                const ids = explorePostsState.get('ids');
                posts = retrievePosts(ids.toJS(), cacheState.toJS());
                nextRequest = explorePostsState.get('nextRequest');
                postsCount = explorePostsState.get('count');
            }
            loading = explorePostsState.get('loading');
        }
        return {
            loading,
            nextRequest,
            posts,
            postsCount,
        };
    },
);

const hooks = {
    defer: ({ dispatch }) => dispatch(explorePosts()),
};

class ExploreKnowledge extends Component {

    handleLoadMore = () => {
        const { dispatch, nextRequest } = this.props;
        dispatch(explorePosts(nextRequest));
    }

    render() {
        const { nextRequest } = this.props;
        return (
            <Container title={t('Explore Knowledge')}>
                <ExploreKnowledgeComponent
                    hasMore={!!nextRequest}
                    onLoadMore={this.handleLoadMore}
                    {...this.props}
                />
            </Container>
        );
    }

};

ExploreKnowledge.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    posts: PropTypes.array,
};

export default provideHooks(hooks)(connect(selector)(ExploreKnowledge));

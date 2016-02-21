import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import { replacePostState } from '../../utils/routes';

import CenterLoadingIndicator from '../CenterLoadingIndicator';
import InfinitePostsList from '../InfinitePostsList';

import PostItem from './PostItem';
import Tabs from './Tabs';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;

const Post = ({ post }, { muiTheme }) => {
    return
};

Post.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

Post.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const EmptyState = () => {
    return (
        <div>
            <p>{t('No posts in this state')}</p>
        </div>
    );
};

const Posts = ({ onLoadMore, posts, state }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let content;
    const postsState = posts[state]
    if (postsState && postsState.posts) {
        if (postsState.posts.length) {
            content = (
                <InfinitePostsList
                    ItemComponent={PostItem}
                    hasMore={!!postsState.nextRequest}
                    loading={postsState.loading}
                    onLoadMore={onLoadMore}
                    posts={postsState.posts}
                />
            );
        } else {
            content = <EmptyState />;
        }
    } else {
        content = <CenterLoadingIndicator />;
    };

    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.hi}>{t('My Knowledge')}</h1>
            </section>
            <Tabs
                onRequestChange={replacePostState}
                state={state}
            />
            {content}
        </div>
    );
};

const PostStatePropType = PropTypes.shape({
    posts: PropTypes.array,
    nextRequest: PropTypes.object,
    loading: PropTypes.bool,
    count: PropTypes.number,
});

Posts.propTypes = {
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    posts: PropTypes.shape({
        [LISTED]: PostStatePropType,
        [DRAFT]: PostStatePropType,
    }),
    state: PropTypes.oneOf([LISTED, DRAFT]).isRequired,
};

Posts.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { EmptyState, Tabs };
export default Posts;

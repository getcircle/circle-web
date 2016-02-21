import React, { PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import { replacePostState, routeToEditPost } from '../../utils/routes';

import CenterLoadingIndicator from '../CenterLoadingIndicator';
import DetailContent from '../DetailContent';
import InfinitePostsList from '../InfinitePostsList';
import MoreMenu from '../MoreMenu';
import MoreMenuItem from '../MoreMenuItem';

import PostItem from './PostItem';
import Tabs from './Tabs';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;

const menuChoices = keymirror({
    EDIT: null,
    DELETE: null,
});

const PostItemMenu = ({ hover, onMenuChoice, post }) => {
    function editPost() { onMenuChoice(menuChoices.EDIT, post); }
    function deletePost() { onMenuChoice(menuChoices.DELETE, post); }
    return (
        <MoreMenu hover={hover}>
            <MoreMenuItem onTouchTap={editPost} text={t('Edit')} />
            <MoreMenuItem onTouchTap={deletePost} text={t('Delete')} />
        </MoreMenu>
    );
};
PostItemMenu.propTypes = {
    hover: PropTypes.bool,
    onMenuChoice: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
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

    function handleMenuChoice(choice, post) {
        switch(choice) {
        case menuChoices.EDIT:
            routeToEditPost(post);
            break;
        }
    };

    let content;
    const postsState = posts[state]
    if (postsState && postsState.posts) {
        if (postsState.posts.length) {
            content = (
                <div className="row">
                    <InfinitePostsList
                        ItemComponent={PostItem}
                        MenuComponent={PostItemMenu}
                        className="col-xs-6"
                        hasMore={!!postsState.nextRequest}
                        loading={postsState.loading}
                        onLoadMore={onLoadMore}
                        onMenuChoice={handleMenuChoice}
                        posts={postsState.posts}
                    />
                </div>
            );
        } else {
            content = <EmptyState />;
        }
    } else {
        content = <CenterLoadingIndicator />;
    };

    return (
        <div>
            <DetailContent>
                <h1 style={theme.h1}>{t('My Knowledge')}</h1>
            </DetailContent>
            <Tabs
                onRequestChange={replacePostState}
                state={state}
            />
            <DetailContent>
                {content}
            </DetailContent>
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

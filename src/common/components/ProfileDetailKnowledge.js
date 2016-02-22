import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToDrafts, routeToNewPost, routeToPost } from '../utils/routes';
import { showConfirmDeleteModal } from '../actions/posts';

import DetailSection from './DetailSectionV2';
import InfinitePostsList from './InfinitePostsList';
import PostItemMenu, { MENU_CHOICES } from './PostItemMenu';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import MenuItem from './MenuItem';

const EditKnowledgeMenu = (props, { muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );
    return (
        <IconMenu
            iconElement={icon}
        >
            <MenuItem onTouchTap={routeToNewPost} text={t('Add Knowledge')} />
            <MenuItem onTouchTap={routeToDrafts} text={t('My Drafts')} />
        </IconMenu>
    );
};

EditKnowledgeMenu.propTypes = {
    hover: PropTypes.bool,
};

EditKnowledgeMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const Posts = (props, { store: { dispatch } }) => {

    function handleMenuChoice(choice, post) {
        switch(choice) {
        case MENU_CHOICES.EDIT:
            routeToPost(post);
            break;
        case MENU_CHOICES.DELETE:
            dispatch(showConfirmDeleteModal(post));
            break;
        }
    };

    return (
        <DetailSection dividerStyle={{marginBottom: 0}}>
            <InfinitePostsList
                MenuComponent={PostItemMenu}
                onMenuChoice={handleMenuChoice}
                {...props}
            />
        </DetailSection>
    );
};

Posts.contextTypes = {
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const ProfileDetailKnowledge = ({ hasMorePosts, onLoadMorePosts, posts, postsLoading }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let postsSection;
    if (posts && posts.length) {
        postsSection = (
            <Posts
                hasMore={hasMorePosts}
                loading={postsLoading}
                onLoadMore={onLoadMorePosts}
                posts={posts}
            />
        );
    }
    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('Knowledge')}</h1>
                <EditKnowledgeMenu />
            </section>
            <section className="row">
                <section className="col-xs-8" style={theme.section}>
                    {postsSection}
                </section>
            </section>
        </div>
    );
};

ProfileDetailKnowledge.propTypes = {
    hasMorePosts: PropTypes.bool.isRequired,
    onLoadMorePosts: PropTypes.func,
    posts: PropTypes.array,
    postsLoading: PropTypes.bool,
};

ProfileDetailKnowledge.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { Posts };
export default ProfileDetailKnowledge;

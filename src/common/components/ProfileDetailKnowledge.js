import React, { PropTypes } from 'react';

import t from '../utils/gettext';
import { routeToDrafts, routeToNewPost, routeToEditPost } from '../utils/routes';
import { showConfirmDeleteModal } from '../actions/posts';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import DetailSection from './DetailSectionV2';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import InfinitePostsList from './InfinitePostsList';
import LightBulbIcon from './LightBulbIcon';
import MenuItem from './MenuItem';
import PostItemMenu, { MENU_CHOICES } from './PostItemMenu';

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

const Posts = ({ canEdit, ...other }, { store: { dispatch } }) => {

    function handleMenuChoice(choice, post) {
        switch(choice) {
        case MENU_CHOICES.EDIT:
            routeToEditPost(post);
            break;
        case MENU_CHOICES.DELETE:
            dispatch(showConfirmDeleteModal(post));
            break;
        }
    };

    let menu;
    if (canEdit) {
        menu = PostItemMenu;
    }

    return (
        <InfinitePostsList
            MenuComponent={menu}
            onMenuChoice={handleMenuChoice}
            {...other}
        />
    );
};

Posts.propTypes = {
    canEdit: PropTypes.bool,
};

Posts.contextTypes = {
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const EmptyState = () => {
    return (
        <div className="row center-xs">
            <span style={{fontSize: '1.6rem', marginTop: 30}}>{t('No knowledge here yet')}</span>
        </div>
    );
};

const ProfileDetailKnowledge = (props, { muiTheme }) => {
    const {
        hasMorePosts,
        isAdmin,
        isLoggedInUser,
        onLoadMorePosts,
        posts,
        postsCount,
        postsLoaded,
        postsLoading,
    } = props;

    const theme = muiTheme.luno.detail;

    let postsSection;
    const postsCountString = postsCount ? ` (${postsCount})` : '';
    if (posts && posts.length) {
        postsSection = (
            <Posts
                canEdit={isLoggedInUser || isAdmin}
                hasMore={hasMorePosts}
                loading={postsLoading}
                onLoadMore={onLoadMorePosts}
                posts={posts}
            />
        );
    } else if (postsLoaded) {
        postsSection = <EmptyState />;
    } else {
        postsSection = <CenterLoadingIndicator />;
    }


    let editMenu;
    // edit menu doesn't show anything interesting for admins
    if (isLoggedInUser) {
        editMenu = <EditKnowledgeMenu />;
    }
    return (
        <div>
            <section className="row middle-xs">
                <LightBulbIcon />
                <h1 style={theme.h1}>{t('Knowledge')}{postsCountString}</h1>
                {editMenu}
            </section>
            <section className="row">
                <section className="col-xs-8" style={theme.section}>
                    <DetailSection dividerStyle={{marginBottom: 0}}>
                        {postsSection}
                    </DetailSection>
                </section>
            </section>
        </div>
    );
};

ProfileDetailKnowledge.propTypes = {
    hasMorePosts: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool,
    isLoggedInUser: PropTypes.bool,
    onLoadMorePosts: PropTypes.func,
    posts: PropTypes.array,
    postsCount: PropTypes.number,
    postsLoaded: PropTypes.bool,
    postsLoading: PropTypes.bool,
};

ProfileDetailKnowledge.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { EmptyState, Posts };
export default ProfileDetailKnowledge;

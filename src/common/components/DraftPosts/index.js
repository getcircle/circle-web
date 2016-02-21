import React, { PropTypes } from 'react';

import { showConfirmDeleteModal } from '../../actions/posts';
import t from '../../utils/gettext';
import { routeToEditPost } from '../../utils/routes';

import CenterLoadingIndicator from '../CenterLoadingIndicator';
import DetailContent from '../DetailContent';
import DetailDivider from '../DetailDivider';
import InfinitePostsList from '../InfinitePostsList';

import PostItemMenu, { MENU_CHOICES } from '../PostItemMenu';

import PostItem from './PostItem';

const EmptyState = (state) => {
    const styles = {
        text: {
            fontSize: '1.6rem',
        },
    };
    return (
        <div className="row center-xs">
            <p style={styles.text}>{t('You have no draft knowledge posts.')}</p>
        </div>
    );
};

const DraftPosts = ({ dispatch, loaded, loading, nextRequest, onLoadMore, posts }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

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

    let content;
    const hasPosts = posts && posts.length;
    if (hasPosts) {
        content = (
            <div className="row">
                <InfinitePostsList
                    ItemComponent={PostItem}
                    MenuComponent={PostItemMenu}
                    className="col-xs-6"
                    hasMore={!!nextRequest}
                    loading={loading}
                    onLoadMore={onLoadMore}
                    onMenuChoice={handleMenuChoice}
                    posts={posts}
                />
            </div>
        );
    } else if (!hasPosts && loaded) {
        content = <EmptyState />;
    } else {
        content = <CenterLoadingIndicator />;
    };

    return (
        <div>
            <DetailContent style={{paddingTop: 30}}>
                <h1 style={theme.h1}>{t('My Drafts')}</h1>
            </DetailContent>
            <DetailDivider style={{marginBottom: 0, marginTop: 30}}/>
            <DetailContent style={{paddingTop: 10}}>
                {content}
            </DetailContent>
        </div>
    );
};

DraftPosts.propTypes = {
    count: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    posts: PropTypes.array,
};

DraftPosts.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export { EmptyState };
export default DraftPosts;

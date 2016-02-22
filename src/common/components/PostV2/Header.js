import React, { PropTypes } from 'react';

import { showConfirmDeleteModal } from '../../actions/posts';
import t from '../../utils/gettext';
import { routeToEditPost } from '../../utils/routes';

import CircularShareShortcutMenu from '../CircularShareMenu';
import InternalPropTypes from '../InternalPropTypes';
import MenuItem from '../MenuItem';
import MoreMenu from '../MoreMenu';

import Author from './Author';
import { createShareMenuItems } from './helpers';

const ShareShortcutMenu = ({ post }, { auth, store: { dispatch } }) => {
    // TODO track sharing of the post
    return (
        <CircularShareShortcutMenu>
            {createShareMenuItems(post, auth, dispatch)}
        </CircularShareShortcutMenu>
    );
};

ShareShortcutMenu.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const AuthorOptionsMenu = ({ post }, { store: { dispatch } }) => {
    function handleEdit() { routeToEditPost(post); }
    function handleDelete() { dispatch(showConfirmDeleteModal(post)); }

    return (
        <MoreMenu style={{marginRight: 10}}>
            <MenuItem onTouchTap={handleEdit} text={t('Edit')} />
            <MenuItem onTouchTap={handleDelete} text={t('Delete')} />
        </MoreMenu>
    );
};

AuthorOptionsMenu.contextTypes = {
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const Header = ({ post }, { auth, muiTheme }) => {
    const styles = {
        header: {
            fontSize: '3.2rem',
            lineHeight: '3.9rem',
            fontWeight: muiTheme.luno.fontWeights.bold,
        },
    };

    let authorOptions;
    if (post.by_profile.id === auth.profile.id) {
        authorOptions = <AuthorOptionsMenu post={post} />;
    }

    return (
        <header>
            <div>
                <h1 style={styles.header}>{post.title}</h1>
            </div>
            <div className="row between-xs middle-xs">
                <Author className="col-xs" post={post} />
                <div className="col-xs-3 row end-xs">
                    {authorOptions}
                    <ShareShortcutMenu post={post} />
                </div>
            </div>
        </header>
    );
};

Header.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

// export for testing
export { Author, AuthorOptionsMenu };
export default Header;

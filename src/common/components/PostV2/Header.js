import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { showConfirmDeleteModal } from '../../actions/posts';
import t from '../../utils/gettext';
import { routeToEditPost, routeToNewPost } from '../../utils/routes';

import AddToCollectionMenu from '../AddToCollectionMenu';
import CircularShareShortcutMenu from '../CircularShareMenu';
import InternalPropTypes from '../InternalPropTypes';
import MenuItem from '../MenuItem';
import MoreMenu from '../MoreMenu';

import Author from './Author';
import { createShareMenuItems } from './helpers';

const ShareShortcutMenu = ({ post }, { auth, store: { dispatch } }) => {
    // TODO track sharing of the post
    return (
        <CircularShareShortcutMenu
            tooltip={t('Share Knowledge')}
        >
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

const OptionsMenu = ({ post }, { auth: { profile }, store: { dispatch } }) => {
    function handleCopy() { routeToNewPost({ post }); }
    function handleEdit() { routeToEditPost(post); }
    function handleDelete() { dispatch(showConfirmDeleteModal(post)); }

    const options = [];
    if (post.by_profile.id === profile.id) {
        options.push(...[
            <MenuItem key="post-option-edit" onTouchTap={handleEdit} text={t('Edit')} />,
            <MenuItem key="post-option-delete" onTouchTap={handleDelete} text={t('Delete')} />,
        ]);
    }
    const copy = <MenuItem key="post-option-copy" onTouchTap={handleCopy} text={t('Copy')} />;
    options.splice(1, 0, copy);

    return (
        <MoreMenu style={{marginRight: 10}}>
            {options}
        </MoreMenu>
    );
};

OptionsMenu.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const Header = ({ collections, editableCollections, memberships, post }, { muiTheme }) => {
    const styles = {
        header: {
            fontSize: '3.2rem',
            lineHeight: '3.9rem',
            fontWeight: muiTheme.luno.fontWeights.bold,
        },
    };

    return (
        <header>
            <div>
                <h1 style={styles.header}>{post.title}</h1>
            </div>
            <div className="row between-xs middle-xs">
                <Author className="col-xs" post={post} />
                <div className="col-xs-3 row end-xs">
                    <OptionsMenu post={post} />
                    <AddToCollectionMenu
                        collections={collections}
                        editableCollections={editableCollections}
                        memberships={memberships}
                        post={post}
                        style={{marginRight: 10}}
                    />
                    <ShareShortcutMenu post={post} />
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collections: PropTypes.array,
    editableCollections: PropTypes.array,
    memberships: PropTypes.array,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

Header.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

// export for testing
export { Author, OptionsMenu };
export default Header;

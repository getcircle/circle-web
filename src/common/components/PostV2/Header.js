import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { showConfirmDeleteModal } from '../../actions/posts';
import t from '../../utils/gettext';
import { routeToEditPost } from '../../utils/routes';

import AddCollectionIcon from '../AddCollectionIcon';
import AddToCollectionForm from '../AddToCollectionForm';
import CircularShareShortcutMenu from '../CircularShareMenu';
import IconMenu from '../IconMenu';
import InternalPropTypes from '../InternalPropTypes';
import MenuItem from '../MenuItem';
import MoreMenu from '../MoreMenu';

import Author from './Author';
import { createShareMenuItems } from './helpers';

const AddToCollectionMenu = ({ collections, editableCollections, post, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.circularIconMenu;
    return (
        <IconMenu
            iconButtonStyle={theme.button}
            iconElement={<AddCollectionIcon {...theme.Icon} />}
            style={theme.menu}
            {...other}
        >
            <AddToCollectionForm
                collections={collections}
                editableCollections={editableCollections}
                post={post}
            />
        </IconMenu>
    );
}

AddToCollectionMenu.propTypes = {
    collections: PropTypes.array,
    editableCollections: PropTypes.array,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

AddToCollectionMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

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

const Header = ({ collections, editableCollections, post }, { auth, muiTheme }) => {
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
                    <AddToCollectionMenu
                        collections={collections}
                        editableCollections={editableCollections}
                        post={post}
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
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

Header.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

// export for testing
export { Author, AuthorOptionsMenu };
export default Header;

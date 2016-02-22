import React, { PropTypes } from 'react';

import CircularShareShortcutMenu from '../CircularShareMenu';
import MenuItem from '../MenuItem';
import MoreMenu from '../MoreMenu';

import Author from './Author';

const ShareShortcutMenu = ({ post }) => {
    return (
        <CircularShareShortcutMenu>
            <MenuItem text={t('Email')} />
            <MenuItem text={t('Copy')} />
        </CircularShareShortcutMenu>
    );
};

const AuthorOptionsMenu = ({ post }) => {
    return (
        <MoreMenu style={{marginLeft: 10}}>
            <MenuItem text={t('Edit')} />
            <MenuItem text={t('Delete')} />
        </MoreMenu>
    );
};

const Header = ({ post }, { muiTheme }) => {
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
                <Author className="col-xs-6" post={post} />
                <div>
                    <ShareShortcutMenu post={post} />
                    <AuthorOptionsMenu post={post} />
                </div>
            </div>
        </header>
    );
};

Header.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Header;

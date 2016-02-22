import React from 'react';

import { showLinkCopiedSnackbar } from '../../actions/posts';
import { mailtoSharePost } from '../../utils/contact';
import { copyUrl } from '../../utils/clipboard';
import t from '../../utils/gettext';

import MenuItem from '../MenuItem';

export function createShareMenuItems(post, auth, dispatch) {
    function handleCopy() {
        copyUrl('post_share_copy');
        dispatch(showLinkCopiedSnackbar());
    };

    return [
        <MenuItem
            href={mailtoSharePost(post, auth.profile)}
            key={'share-menu-email'}
            target="_blank"
            text={t('Email')}
        />,
        <MenuItem
            key={'share-menu-copy'}
            onTouchTap={handleCopy}
            text={t('Copy')}
        />,
    ];
}

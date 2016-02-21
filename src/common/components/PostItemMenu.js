import React, { PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';

import t from '../utils/gettext';

import MoreMenu from './MoreMenu';
import MoreMenuItem from './MoreMenuItem';

export const MENU_CHOICES = keymirror({
    EDIT: null,
    DELETE: null,
});

const PostItemMenu = ({ hover, onMenuChoice, post }) => {
    function editPost() { onMenuChoice(MENU_CHOICES.EDIT, post); }
    function deletePost() { onMenuChoice(MENU_CHOICES.DELETE, post); }
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

export default PostItemMenu;

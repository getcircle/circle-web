import React, { PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';

import t from '../utils/gettext';

import HoverMoreMenu from './HoverMoreMenu';
import MenuItem from './MenuItem';

export const MENU_CHOICES = keymirror({
    EDIT: null,
    DELETE: null,
});

const PostItemMenu = ({ hover, onMenuChoice, post }) => {
    function editPost() { onMenuChoice(MENU_CHOICES.EDIT, post); }
    function deletePost() { onMenuChoice(MENU_CHOICES.DELETE, post); }
    return (
        <HoverMoreMenu hover={hover}>
            <MenuItem onTouchTap={editPost} text={t('Edit')} />
            <MenuItem onTouchTap={deletePost} text={t('Delete')} />
        </HoverMoreMenu>
    );
};

PostItemMenu.propTypes = {
    hover: PropTypes.bool,
    onMenuChoice: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export default PostItemMenu;

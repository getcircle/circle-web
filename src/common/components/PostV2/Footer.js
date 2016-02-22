import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import InternalPropTypes from '../InternalPropTypes';
import IconMenu from '../IconMenu';
import RoundedButton from '../RoundedButton';
import ShareIcon from '../ShareIconV2';

import { createShareMenuItems } from './helpers';

const ShareMenu = ({ post }, { auth, muiTheme, store: { dispatch } }) => {
    const styles = {
        shareLabel: {
            paddingLeft: 0,
            fontWeight: muiTheme.luno.fontWeights.bold,
            letterSpacing: '1px',
        },
    };
    const icon = (
        <ShareIcon
            height={30}
            stroke={muiTheme.luno.tintColor}
            strokeWidth={1}
            width={30}
        />
    );
    const iconButton = (
        <RoundedButton
            icon={icon}
            label={t('Share')}
            labelStyle={styles.shareLabel}
        />
    );
    return (
        <IconMenu
            iconButtonElement={iconButton}
        >
            {createShareMenuItems(post, auth, dispatch)}
        </IconMenu>
    );
};

ShareMenu.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

ShareMenu.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const Footer = ({ post }, { muiTheme }) => {
    return (
        <footer>
            <div className="row end-xs">
                <ShareMenu post={post} />
            </div>
        </footer>
    );
};

Footer.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

Footer.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Footer;

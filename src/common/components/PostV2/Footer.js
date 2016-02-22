import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import IconMenu from '../IconMenu';
import MenuItem from '../MenuItem';
import RoundedButton from '../RoundedButton';
import ShareIcon from '../ShareIconV2';

const ShareMenu = ({ post }, { muiTheme}) => {
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
            <MenuItem text={t('Email')} />
            <MenuItem text={t('Copy')} />
        </IconMenu>
    );
};

ShareMenu.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

ShareMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
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

import { flow } from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { Divider, ListItem } from 'material-ui';

import {
    detectCodeMarkdownAndAddMarkup,
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
    detectLineBreaksAndAddMarkup,
    detectSingleLineCodeMarkdownAndAddMarkup,
    detectURLsAndAddMarkup,
    setTargetBlankOnAnchorTags,
} from '../utils/string';
import t from '../utils/gettext';
import moment from '../utils/moment';

import CircularShareShortcutMenu from './CircularShareMenu';
import DetailContent from './DetailContent';
import IconMenu from './IconMenu';
import MenuItem from './MenuItem';
import MoreMenu from './MoreMenu';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from './RoundedButton';
import ShareIcon from './ShareIconV2';

const Author = ({ post, ...other }, { muiTheme }) => {
    const profile = post.by_profile;
    const styles = {
        container: {
            padding: 0,
        },
        innerDiv: {
            paddingBottom: 20,
            paddingTop: 24,
        },
        lastUpdated: {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.lightBlack,
            lineHeight: '1.6rem',
        },
        primaryText: {
            fontSize: '1.6rem',
            lineHeight: '1.9rem',
        },
        secondaryText: {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.lightBlack,
            marginTop: 5,
        },
    };
    const lastUpdated = moment(post.changed).fromNow()
    const primaryText = (
        <span style={styles.primaryText}>
            {profile.full_name}
            <span style={styles.lastUpdated}>
                {t(`\u2013 last updated ${lastUpdated}`)}
            </span>
        </span>
    );

    const secondaryText = (
        <div>
            <span style={styles.secondaryText}>{profile.display_title}</span>
        </div>
    );

    return (
        <div style={styles.container} {...other}>
            <ListItem
                innerDivStyle={styles.innerDiv}
                leftAvatar={<ProfileAvatar profile={profile} style={muiTheme.luno.avatar}/>}
                primaryText={primaryText}
                secondaryText={secondaryText}
            />
        </div>
    );
};

Author.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const ShareShortcutMenu = ({ post }) => {
    return (
        <CircularShareShortcutMenu>
            <MenuItem text={t('Email')} />
            <MenuItem text={t('Copy')} />
        </CircularShareShortcutMenu>
    );
};

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

ShareMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
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

const Footer = ({ post }, { muiTheme }) => {
    return (
        <footer>
            <div className="row end-xs">
                <ShareMenu post={post} />
            </div>
        </footer>
    );
};

Footer.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const Content = ({ post }) => {
    const styles = {
        divider: {
            marginTop: 50,
            marginBottom: 30,
        },
        root: {
            paddingTop: 35,
        },
    };
    const detectPatternsAndAddMarkup = flow(
        setTargetBlankOnAnchorTags,
        detectCodeMarkdownAndAddMarkup,
        detectURLsAndAddMarkup,
        detectEmailsAndAddMarkup,
        detectHashtagsAndAddMarkup,
        detectSingleLineCodeMarkdownAndAddMarkup,
        detectLineBreaksAndAddMarkup,
    );
    const finalContent = detectPatternsAndAddMarkup(post.content);
    return (
        <div>
            <div
                className="luno-editor"
                dangerouslySetInnerHTML={{__html: finalContent}}
                style={styles.root}
            />
            <Divider style={styles.divider} />
        </div>
    );
};

const Post = ({ onDelete, post, ...other }) => {
    return (
        <DetailContent style={{paddingTop: 10}}>
            <Header post={post} />
            <Content post={post} />
            <Footer post={post} />
        </DetailContent>
    );
};

Post.propTypes = {
    onDelete: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export { Content, Footer, Header };
export default Post;

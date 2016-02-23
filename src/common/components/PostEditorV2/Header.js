import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { services } from 'protobufs';

import { FlatButton } from 'material-ui';

import t from '../../utils/gettext';
import { routeToPost } from '../../utils/routes';

import LeftChevronIcon from '../LeftChevronIcon';
import RoundedButton from '../RoundedButton';

const { PostStateV1 } = services.post.containers;

const BackButton = (props, { muiTheme }) => {
    function handleTouchTap() { browserHistory.goBack(); }
    return (
        <FlatButton
            label={t('Back')}
            labelStyle={{color: muiTheme.luno.tintColor, paddingLeft: 25}}
            onTouchTap={handleTouchTap}
        >
            <LeftChevronIcon
                stroke={muiTheme.luno.tintColor}
                style={{position: 'absolute', top: '3px'}}
            />
        </FlatButton>
    );
};

BackButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const PublishButton = (props, { muiTheme }) => {
    const styles = {
        button: {
            backgroundColor: muiTheme.luno.tintColor,
            lineHeight: '4.0rem',
            minWidth: 100,
        },
        label: {
            color: muiTheme.luno.colors.white,
        },
    };
    return (
        <RoundedButton
            label={t('Publish')}
            labelStyle={styles.label}
            style={styles.button}
            {...props}
        />
    );
};

PublishButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const Header = ({ post, onPublish, saving }, { muiTheme }) => {
    function handleTouchTap() {
        post.state = PostStateV1.LISTED;
        onPublish(post);
        routeToPost(post);
    }

    let saveNotification;
    if (post.id && [PostStateV1.DRAFT, null].includes(post.state)) {
        let text;
        if (saving) {
            text = t('Draft Saving...');
        } else {
            text = t('Draft Saved');
        }
        const style = {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.extraLightBlack,
            paddingRight: 30,
        };
        saveNotification = <span style={style}>{text}</span>;
    }

    return (
        <header style={{paddingLeft: 10, paddingRight: 10}}>
            <section className="row between-xs">
                <div className="start-xs col-xs">
                    <BackButton />
                </div>
                <div className="end-xs col-xs">
                    {saveNotification}
                    <PublishButton onTouchTap={handleTouchTap} />
                </div>
            </section>
        </header>
    );
};

Header.propTypes = {
    onPublish: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    saving: PropTypes.bool,
};

Header.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Header;

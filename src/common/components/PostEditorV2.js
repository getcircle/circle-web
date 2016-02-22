import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { services } from 'protobufs';

import { FlatButton } from 'material-ui';

import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';
import AutogrowTextarea from './AutogrowTextarea';
import DetailContent from './DetailContent';
import ListItemProfile from './ListItemProfile';
import LeftChevronIcon from './LeftChevronIcon';
import RoundedButton from './RoundedButton';

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

const Header = () => {
    return (
        <header style={{paddingLeft: 10, paddingRight: 10}}>
            <section className="row between-xs">
                <div className="start-xs col-xs">
                    <BackButton />
                </div>
                <div className="end-xs col-xs">
                    <PublishButton />
                </div>
            </section>
        </header>
    );
};

const EditorContainer = ({ post }, { device: { mounted }, muiTheme }) => {
    const styles = {
        container: {
            backgroundColor: muiTheme.luno.colors.white,
            borderRadius: '6px',
            border: `1px solid ${muiTheme.luno.colors.lightWhite}`,
            marginTop: 30,
        },
        editor: {
            padding: 30,
            paddingTop: 0,
        },
        title: {
            padding: 30,
        },
        textarea: {
            border: '0',
            fontSize: '3.2rem',
            lineHeight: '3.9rem',
            fontWeight: muiTheme.luno.fontWeights.bold,
            minHeight: 49,
        },
    };
    let editor;
    if (mounted) {
        // We add the editor related code only on the client
        // because the library we use relies on DOM to be present.
        // It uses the global window object, event listeners, query
        // selectors, and the full Node and Element objects.
        const Editor = require('./Editor');
        editor = (
            <Editor
                style={styles.editor}
                value={post.content}
            />
        );
    }
    return (
        <div style={styles.container}>
            <AutogrowTextarea
                autoFocus={true}
                placeholder={t('Title')}
                singleLine={true}
                style={styles.title}
                textareaStyle={styles.textarea}
                value={post.title}
            />
            {editor}
        </div>
    );
};

EditorContainer.contextTypes = {
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
};

const PostEditor = ({ post, profile }) => {
    return (
        <div>
            { /* this could be an admin editing the post, we should still show the original author */ }
            <Header profile={profile} />
            <DetailContent>
                <ListItemProfile disabled={true} profile={profile} />
                <EditorContainer post={post} />
            </DetailContent>
        </div>
    );
};

PostEditor.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
};

export default PostEditor;

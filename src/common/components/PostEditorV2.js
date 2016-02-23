import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { services } from 'protobufs';
import Immutable from 'immutable';

import { FlatButton } from 'material-ui';

import { titleChanged, contentChanged } from '../actions/editor';
import t from '../utils/gettext';
import { routeToPost } from '../utils/routes';

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

const Header = ({ post, onPublish }) => {
    function handleTouchTap() {
        onPublish(post);
        routeToPost(post);
    }

    return (
        <header style={{paddingLeft: 10, paddingRight: 10}}>
            <section className="row between-xs">
                <div className="start-xs col-xs">
                    <BackButton />
                </div>
                <div className="end-xs col-xs">
                    <PublishButton onTouchTap={handleTouchTap} />
                </div>
            </section>
        </header>
    );
};

Header.propTypes = {
    onPublish: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.Postv1),
};

const EditorContainer = (props, context) => {
    const { onFileDelete, onFileUpload, post, uploadProgress, uploadedFiles } = props;
    const { device: { mounted }, muiTheme, store: { dispatch } } = context;

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

    function handleTitleChange(event, value) {
        dispatch(titleChanged(value, true))
    };

    let editor;
    if (mounted) {
        // We add the editor related code only on the client
        // because the library we use relies on DOM to be present.
        // It uses the global window object, event listeners, query
        // selectors, and the full Node and Element objects.
        const Editor = require('./Editor');

        function handleContentChange(event) {
            dispatch(contentChanged(event.target.value));
        };

        editor = (
            <Editor
                onChange={handleContentChange}
                onFileDelete={onFileDelete}
                onFileUpload={onFileUpload}
                style={styles.editor}
                uploadProgress={uploadProgress}
                uploadedFiles={uploadedFiles}
                value={post.content}
            />
        );
    }
    return (
        <div style={styles.container}>
            <AutogrowTextarea
                autoFocus={true}
                onChange={handleTitleChange}
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

EditorContainer.propTypes = {
    onFileDelete: PropTypes.func,
    onFileUpload: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

EditorContainer.contextTypes = {
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

class PostEditor extends Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.post.id === nextProps.post.id) {
            const hasChanged = (
                this.props.post.content !== nextProps.post.content ||
                this.props.post.title !== nextProps.post.title
            );
            if (
                hasChanged &&
                nextProps.autoSave &&
                nextProps.post.content &&
                nextProps.post.title
            ) {
                this.save(nextProps);
            }
        }
    }

    saveTimeout = null

    save(props) {
        const { onSave, post } = props;
        if (this.saveTimeout !== null) {
            window.clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = window.setTimeout(() => {
            onSave(post);
        }, 500);
    }

    render() {
        const { onFileDelete, onFileUpload, onSave, post, profile, uploadProgress, uploadedFiles } = this.props;
        return (
            <div>
                { /* this could be an admin editing the post, we should still show the original author */ }
                <Header
                    onPublish={onSave}
                    post={post}
                    profile={profile}
                />
                <DetailContent>
                    <ListItemProfile disabled={true} profile={profile} />
                    <EditorContainer
                        onFileDelete={onFileDelete}
                        onFileUpload={onFileUpload}
                        post={post}
                        uploadProgress={uploadProgress}
                        uploadedFiles={uploadedFiles}
                    />
                </DetailContent>
            </div>
        );
    }

};

PostEditor.propTypes = {
    autoSave: PropTypes.bool,
    onFileDelete: PropTypes.func,
    onFileUpload: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

PostEditor.defaultProps = {
    uploadProgress: Immutable.Map(),
    uploadedFiles: Immutable.Map(),
};

export default PostEditor;

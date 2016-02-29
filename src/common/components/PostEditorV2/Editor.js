import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { titleChanged, contentChanged } from '../../actions/editor';
import t from '../../utils/gettext';
import KeyCodes from '../../constants/KeyCodes';

import InternalPropTypes from '../InternalPropTypes';
import AutogrowTextarea from '../AutogrowTextarea';

class Editor extends Component {

    render() {
        const { onFileDelete, onFileUpload, post, uploadProgress, uploadedFiles } = this.props;
        const { device: { mounted }, muiTheme, store: { dispatch } } = this.context;

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
                fontWeight: muiTheme.luno.fontWeights.bold,
                lineHeight: '3.9rem',
                minHeight: 49,
            },
        };

        function handleTitleChange(event, value) {
            dispatch(titleChanged(value, true))
        };

        const handleTitleKeyDown = (event) => {
            const triggerKeyCodes = [KeyCodes.TAB, KeyCodes.ENTER];
            if (event.keyCode && triggerKeyCodes.indexOf(event.keyCode) !== -1 && this.refs.editor) {
                this.refs.editor.focus();
                event.preventDefault();
            }
        };

        let editor;
        if (mounted) {
            // We add the editor related code only on the client
            // because the library we use relies on DOM to be present.
            // It uses the global window object, event listeners, query
            // selectors, and the full Node and Element objects.
            const TrixEditor = require('../Editor');

            function handleContentChange(event) {
                dispatch(contentChanged(event.target.value));
            };

            editor = (
                <TrixEditor
                    onChange={handleContentChange}
                    onFileDelete={onFileDelete}
                    onFileUpload={onFileUpload}
                    ref="editor"
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
                    onKeyDown={handleTitleKeyDown}
                    placeholder={t('Title')}
                    singleLine={true}
                    style={styles.title}
                    textareaStyle={styles.textarea}
                    value={post.title}
                />
                {editor}
            </div>
        );
    }
};

Editor.propTypes = {
    onFileDelete: PropTypes.func,
    onFileUpload: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

Editor.contextTypes = {
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

export default Editor;

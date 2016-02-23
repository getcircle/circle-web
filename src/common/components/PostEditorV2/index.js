import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';
import Immutable from 'immutable';

import DetailContent from '../DetailContent';
import ListItemProfile from '../ListItemProfile';

import Editor from './Editor';
import Header from './Header';

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
        const { onFileDelete, onFileUpload, onSave, post, profile, saving, uploadProgress, uploadedFiles } = this.props;
        return (
            <div>
                { /* this could be an admin editing the post, we should still show the original author */ }
                <Header
                    onPublish={onSave}
                    post={post}
                    profile={profile}
                    saving={saving}
                />
                <DetailContent>
                    <ListItemProfile disabled={true} profile={profile} />
                    <Editor
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
    saving: PropTypes.bool,
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

PostEditor.defaultProps = {
    uploadProgress: Immutable.Map(),
    uploadedFiles: Immutable.Map(),
};

export default PostEditor;

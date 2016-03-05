import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';
import Immutable from 'immutable';

import { updateCollections } from '../../utils/collections';

import DetailContent from '../DetailContent';
import ListItemProfile from '../ListItemProfile';
import EditPostCollectionsForm from '../EditPostCollectionsForm';

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

    handlePublish = (post) => {
        if (this.refs.form) {
            this.refs.form.submit();
        }
        this.props.onSave(post);
    }

    handleSubmitCollections = (form, dispatch) => {
        updateCollections(dispatch, this.props.post, this.props.collections, form.collections);
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
        const {
            collections,
            collectionsLoaded,
            editableCollections,
            memberships,
            onFileDelete,
            onFileUpload,
            post,
            profile,
            saving,
            uploadProgress,
            uploadedFiles,
        } = this.props;

        let form;
        if (post) {
            form = (
                <EditPostCollectionsForm
                    collections={collections}
                    collectionsLoaded={collectionsLoaded}
                    editableCollections={editableCollections}
                    memberships={memberships}
                    onSubmit={this.handleSubmitCollections}
                    post={post}
                    ref="form"
                    style={{paddingTop: 10}}
                />
            );
        }

        return (
            <div>
                { /* this could be an admin editing the post, we should still show the original author */ }
                <Header
                    onPublish={this.handlePublish}
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
                    {form}
                </DetailContent>
            </div>
        );
    }

};

PostEditor.propTypes = {
    autoSave: PropTypes.bool,
    collections: PropTypes.array,
    collectionsLoaded: PropTypes.bool,
    editableCollections: PropTypes.array,
    memberships: PropTypes.array,
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

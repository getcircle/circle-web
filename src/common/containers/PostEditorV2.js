import { merge } from 'lodash';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';
import { reset as reduxFormReset } from 'redux-form';

import { createPost, getPost, updatePost } from '../actions/posts';
import {
    addPostToCollections,
    getCollections,
    getEditableCollections,
    removePostFromCollections,
} from '../actions/collections';
import { clearFileUploads, deleteFiles, uploadFile } from '../actions/files';
import { reset } from '../actions/editor';

import { resetScroll } from '../utils/window';
import { retrievePost, retrieveCollections } from '../reducers/denormalizations';
import { getCollectionsNormalizations } from '../reducers/normalizations';
import { replaceWithEditPost } from '../utils/routes';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import { default as PostEditorComponent } from '../components/PostEditorV2';

const REQUIRED_FIELDS = ['content', 'by_profile'];

const { PostStateV1 } = services.post.containers;
const { SourceV1 } = services.post.containers.CollectionItemV1;

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.editorSelector,
        selectors.filesSelector,
        selectors.editableCollectionsSelector,
        selectors.authenticationSelector,
    ],
    (cacheState, paramsState, editorState, filesState, editableCollectionsState, authenticationState) => {
        let collections, editableCollections, post;

        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        if (postId) {
            post = retrievePost(postId, cache, REQUIRED_FIELDS);
        } else {
            post = new services.post.containers.PostV1();
        }

        const title = editorState.get('title').get('value');
        if (title !== undefined && title !== null) {
            post.title = title;
        }
        const content = editorState.get('content');
        if (content !== null) {
            post.content = content;
        }

        const collectionIds = getCollectionsNormalizations(postId, cache);
        if (collectionIds) {
            collections = retrieveCollections(collectionIds, cache);
        }

        const profile = authenticationState.get('profile');
        const editableCollectionIds = getCollectionsNormalizations(profile.id, cache);
        if (editableCollectionIds) {
            editableCollections = retrieveCollections(editableCollectionIds, cache);
        }

        return {
            collections,
            editableCollections,
            post,
            draft: editorState.get('draft'),
            saving: editorState.get('saving'),
            uploadProgress: filesState.get('progress'),
            uploadedFiles: filesState.get('files'),
        };
    }
);

function fetchPost({ dispatch, params: { postId } }) {
    if (postId) {
        return dispatch(getPost(postId, REQUIRED_FIELDS));
    }
}

function fetchCollections({ dispatch, params: { postId } }) {
    if (postId) {
        return dispatch(getCollections({source: SourceV1.LUNO, sourceId: postId}));
    }
}

function fetchEditableCollections({ dispatch, getState }) {
    const state = getState();
    const profile = state.get('authentication').get('profile');
    dispatch(getEditableCollections(profile.id));
}

function updateCollections(dispatch, post, initialCollections, collections) {
    const collectionsToAdd = [];
    const collectionsToRemove = [];
    const initialCollectionIds = initialCollections.map(collection => collection.id);
    const collectionIds = collections.map(collection => collection.id);
    for (let collection of collections) {
        if (!initialCollectionIds.includes(collection.id)) {
            collectionsToAdd.push(collection);
        }
    }

    for (let collection of initialCollections) {
        if (!collectionIds.includes(collection.id)) {
            collectionsToRemove.push(collection);
        }
    }

    if (collectionsToRemove.length) {
        dispatch(removePostFromCollections(post, collectionsToRemove));
    }

    if (collectionsToAdd.length) {
        dispatch(addPostToCollections(post, collectionsToAdd));
    }
    dispatch(reduxFormReset('editPostCollections'));
}

const hooks = {
    fetch: locals => fetchPost(locals),
    defer: (locals) => {
        fetchCollections(locals);
        fetchEditableCollections(locals);
    },
};

class PostEditor extends Component {

    componentWillMount() {
        resetScroll();
    }

    componentWillReceiveProps(nextProps) {
        // TODO redirect to view post if current user doesn't have permission
        if (nextProps.params.postId !== this.props.params.postId) {
            fetchPost(nextProps);
            resetScroll();
        }
        if (nextProps.draft) {
            this.props.dispatch(reset());
            replaceWithEditPost(nextProps.draft);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearFileUploads());
        this.props.dispatch(reset());
    }

    handleSave = (post) => {
        if (post.id) {
            // not sure if there is a better way to hook into the state of the form
            // than accessing the form state directly. we need to do this
            // because the publish button drives the form submission
            const state = this.context.store.getState();
            const form = state.get('form').editPostCollections;
            const initialCollections = this.props.collections;
            updateCollections(
                this.props.dispatch,
                post,
                initialCollections,
                form.collections.value,
            );
            this.props.dispatch(updatePost(post));
        } else {
            this.props.dispatch(createPost(post));
        }
    }

    handleFileDelete = (fileIds) => {
        if (fileIds && fileIds.length) {
            this.props.dispatch(deleteFiles(fileIds));
        }
    }

    handleFileUpload = (file) => {
        this.props.dispatch(uploadFile(file.name, file.type, file));
    }

    render() {
        const {
            collections,
            editableCollections,
            post,
            saving,
            uploadProgress,
            uploadedFiles,
        } = this.props;
        const { auth: { profile }, muiTheme } = this.context;

        let content;
        if (post) {
            const autoSave = [PostStateV1.DRAFT, null].includes(post.state) ? true : false;
            content = (
                <DocumentTitle title={post.title}>
                    <PostEditorComponent
                        autoSave={autoSave}
                        collections={collections}
                        editableCollections={editableCollections}
                        onFileDelete={this.handleFileDelete}
                        onFileUpload={this.handleFileUpload}
                        onSave={this.handleSave}
                        post={post}
                        profile={profile}
                        saving={saving}
                        uploadProgress={uploadProgress}
                        uploadedFiles={uploadedFiles}
                    />
                </DocumentTitle>
            );
        } else  {
            content = <CenterLoadingIndicator />;
        }

        const style = merge({paddingTop: '10px'}, muiTheme.luno.managePage.container);
        return (
            <Container style={style}>
                {content}
            </Container>
        );
    }

}

PostEditor.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
    params: PropTypes.shape({
        postId: PropTypes.string,
    }),
    post: InternalPropTypes.PostV1,
    saving: PropTypes.bool,
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

PostEditor.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    store: PropTypes.object,
    muiTheme: PropTypes.object.isRequired,
};

export { PostEditor, selector };
export default provideHooks(hooks)(connect(selector)(PostEditor));

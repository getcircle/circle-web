import { merge } from 'lodash';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { createPost, getPost, updatePost } from '../actions/posts';
import { getCollections, getEditableCollections } from '../actions/collections';
import { clearFileUploads, deleteFiles, uploadFile } from '../actions/files';
import { reset } from '../actions/editor';

import { resetScroll } from '../utils/window';
import { retrievePost, retrieveCollections } from '../reducers/denormalizations';
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
        selectors.postCollectionsSelector,
    ],
    (cacheState, paramsState, editorState, filesState, editableCollectionsState, postCollectionsState) => {
        let collections, collectionsLoaded, editableCollections, post;

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

        if (postCollectionsState.has(postId)) {
            const ids = postCollectionsState.get(postId).get('ids');
            if (ids && ids.size) {
                collections = retrieveCollections(ids.toJS(), cache);
            }
            collectionsLoaded = postCollectionsState.get(postId).get('loaded');
        }

        const editableCollectionIds = editableCollectionsState.get('collectionIds');
        if (editableCollectionIds.size) {
            editableCollections = retrieveCollections(editableCollectionIds.toJS(), cache);
        }

        return {
            collections,
            collectionsLoaded,
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

function loadPost(locals) {
    fetchPost(locals);
    fetchCollections(locals);
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
            loadPost(nextProps);
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
            collectionsLoaded,
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
                        collectionsLoaded={collectionsLoaded}
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
    collectionsLoaded: PropTypes.bool,
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

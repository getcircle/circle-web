import { merge } from 'lodash';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { createPost, getPost, updatePost } from '../actions/posts';
import { clearFileUploads, deleteFiles, uploadFile } from '../actions/files';
import { reset } from '../actions/editor';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { replaceWithEditPost } from '../utils/routes';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import { default as PostEditorComponent } from '../components/PostEditorV2';

const REQUIRED_FIELDS = ['content', 'by_profile'];

const { PostStateV1 } = services.post.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.editorSelector,
        selectors.filesSelector,
    ],
    (cacheState, paramsState, editorState, filesState) => {
        let post;

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

        return {
            post,
            draft: editorState.get('draft'),
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

const hooks = {
    fetch: locals => fetchPost(locals),
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
        const { post, uploadProgress, uploadedFiles } = this.props;
        const { auth: { profile }, muiTheme } = this.context;

        let content;
        if (post) {
            const autoSave = [PostStateV1.DRAFT, null].includes(post.state) ? true : false;
            content = (
                <DocumentTitle title={post.title}>
                    <PostEditorComponent
                        autoSave={autoSave}
                        onFileDelete={this.handleFileDelete}
                        onFileUpload={this.handleFileUpload}
                        onSave={this.handleSave}
                        post={post}
                        profile={profile}
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
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        postId: PropTypes.string,
    }),
    post: InternalPropTypes.PostV1,
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

PostEditor.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

export { PostEditor, selector };
export default provideHooks(hooks)(connect(selector)(PostEditor));

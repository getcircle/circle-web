import { merge } from 'lodash';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';

import { getPost, updatePost } from '../actions/posts';
import { clearFileUploads, deleteFiles, uploadFile } from '../actions/files';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import PostEditor from '../components/PostEditorV2';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
        selectors.editorSelector,
        selectors.filesSelector,
    ],
    (cacheState, postState, paramsState, editorState, filesState) => {
        let post;
        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        if (postState.get('ids').has(postId)) {
            post = retrievePost(postId, cache, ['content', 'by_profile']);
        }

        // TODO add logic to derive title from body
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
            uploadProgress: filesState.get('progress'),
            uploadedFiles: filesState.get('files'),
        };
    }
);

function fetchPost({ dispatch, params }) {
    return dispatch(getPost(params.postId));
}

const hooks = {
    fetch: locals => fetchPost(locals),
};

class EditPost extends Component {

    componentWillMount() {
        resetScroll();
    }

    componentWillReceiveProps(nextProps) {
        // TODO redirect to view post if current user doesn't have permission
        if (nextProps.params.postId !== this.props.params.postId) {
            fetchPost(nextProps);
            resetScroll();
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearFileUploads());
    }

    handleSave = (post) => {
        this.props.dispatch(updatePost(post));
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
            content = (
                <DocumentTitle title={post.title}>
                    <PostEditor
                        autoSave={false}
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

EditPost.propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    }).isRequired,
    post: InternalPropTypes.PostV1,
    uploadProgress: PropTypes.object,
    uploadedFiles: PropTypes.object,
};

EditPost.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

export default provideHooks(hooks)(connect(selector)(EditPost));

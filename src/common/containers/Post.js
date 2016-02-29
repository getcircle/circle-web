import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';
import { browserHistory } from 'react-router';

import { Snackbar } from 'material-ui';

import { deletePost, hideConfirmDeleteModal, hideLinkCopiedSnackbar, getPost } from '../actions/posts';
import { getCollections, getEditableCollections } from '../actions/collections';

import { resetScroll } from '../utils/window';
import { retrieveCollections, retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DeletePostConfirmation from '../components/DeletePostConfirmation';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import { default as PostComponent } from '../components/PostV2';

const REQUIRED_FIELDS = ['content', 'by_profile'];

const { SourceV1 } = services.post.containers.CollectionItemV1;

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
        selectors.deletePostSelector,
        selectors.editableCollectionsSelector,
        selectors.postCollectionsSelector,
    ],
    (cacheState, postState, paramsState, deletePostState, editableCollectionsState, postCollectionsState) => {
        let collections, editableCollections;
        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        const post = retrievePost(postId, cache, REQUIRED_FIELDS);
        const showLinkCopied = postState.get('showLinkCopied');

        if (postCollectionsState.has(postId)) {
            const ids = postCollectionsState.get(postId).get('ids');
            if (ids && ids.size) {
                collections = retrieveCollections(ids.toJS(), cache);
            }
        }

        const editableCollectionIds = editableCollectionsState.get('collectionIds');
        if (editableCollectionIds && editableCollectionIds.size) {
            editableCollections = retrieveCollections(editableCollectionIds.toJS(), cache);
        }

        return {
            collections,
            editableCollections,
            showLinkCopied,
            errorDetails: postState.get('errorDetails'),
            post: post,
            modalVisible: deletePostState.get('modalVisible'),
            pendingPostToDelete: deletePostState.get('pendingPostToDelete'),
        };
    }
);

function fetchPost({ dispatch, params }) {
    return dispatch(getPost(params.postId, REQUIRED_FIELDS));
}

function fetchCollections({ dispatch, params: { postId } }) {
    return dispatch(getCollections({source: SourceV1.LUNO, sourceId: postId}));
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

const ErrorMessage = ({ details }, { muiTheme }) => {
    const styles = {
        container: {
            fontSize: '16px',
            height: '100%',
            lineHeight: '40px',
            minHeight: '50vh',
            whiteSpace: 'pre-wrap',
            width: '100%',
            color: muiTheme.luno.colors.lightBlack,
        },
    };

    let message;
    details.forEach(error => {
        switch (error.detail) {
        case 'INVALID':
        case 'DOES_NOT_EXIST':
            message = t('No knowledge post found.\nThe post has either been deleted by the author or you have an incorrect URL.');
            break;
        }
    });

    return (
        <p className="row center-xs middle-xs" style={styles.container}>
            {message}
        </p>
    );
};

ErrorMessage.propTypes = {
    details: PropTypes.object.isRequired,
};

ErrorMessage.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

class Post extends Component {

    componentWillMount() {
        resetScroll();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.postId !== this.props.params.postId) {
            loadPost(nextProps);
            resetScroll();
        }
    }

    handleCloseSnackbar = () => {
        this.props.dispatch(hideLinkCopiedSnackbar());
    }

    handleCloseDeleteConfirmation = () => {
        this.props.dispatch(hideConfirmDeleteModal());
    }

    handleDeleteConfirmation = () => {
        const { dispatch, pendingPostToDelete } = this.props;
        dispatch(hideConfirmDeleteModal());
        dispatch(deletePost(pendingPostToDelete));
        browserHistory.goBack();
    }

    render() {
        const {
            collections,
            editableCollections,
            errorDetails,
            modalVisible,
            pendingPostToDelete,
            post,
        } = this.props;

        let content;
        if (post) {
            content = (
                <DocumentTitle title={post.title}>
                    <PostComponent
                        collections={collections}
                        editableCollections={editableCollections}
                        post={post}
                    />
                </DocumentTitle>
            );
        } else if (errorDetails.size) {
            content = <ErrorMessage details={errorDetails} />;
        } else  {
            content = <CenterLoadingIndicator />;
        }

        return (
            <Container style={{paddingTop: '50px'}}>
                {content}
                <Snackbar
                    autoHideDuration={2000}
                    bodyStyle={{minWidth: 'inherit'}}
                    message={t('Link copied to clipboard!')}
                    onRequestClose={this.handleCloseSnackbar}
                    open={this.props.showLinkCopied}
                />
                <DeletePostConfirmation
                    onRequestClose={this.handleCloseDeleteConfirmation}
                    onSave={this.handleDeleteConfirmation}
                    open={modalVisible}
                    post={pendingPostToDelete}
                />
            </Container>
        );
    }

}

Post.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editableCollections: PropTypes.array,
    errorDetails: PropTypes.object,
    modalVisible: PropTypes.bool,
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    }).isRequired,
    pendingPostToDelete: PropTypes.instanceOf(services.post.containers.PostV1),
    post: InternalPropTypes.PostV1,
    showLinkCopied: PropTypes.bool,
};

export default provideHooks(hooks)(connect(selector)(Post));

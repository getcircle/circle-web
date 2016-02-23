import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';
import { browserHistory } from 'react-router';

import { Snackbar } from 'material-ui';

import { deletePost, hideConfirmDeleteModal, hideLinkCopiedSnackbar, getPost } from '../actions/posts';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DeletePostConfirmation from '../components/DeletePostConfirmation';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import { default as PostComponent } from '../components/PostV2';

const REQUIRED_FIELDS = ['content', 'by_profile'];

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
        selectors.deletePostSelector,
    ],
    (cacheState, postState, paramsState, deletePostState) => {
        let post;
        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        if (postState.get('ids').has(postId)) {
            post = retrievePost(postId, cache, REQUIRED_FIELDS);
        }

        const showLinkCopied = postState.get('showLinkCopied');
        return {
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

const hooks = {
    fetch: locals => fetchPost(locals),
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
            fetchPost(nextProps);
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
        const { errorDetails, modalVisible, pendingPostToDelete, post } = this.props;

        let content;
        if (post) {
            content = (
                <DocumentTitle title={post.title}>
                    <PostComponent post={post} />
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
    dispatch: PropTypes.func.isRequired,
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

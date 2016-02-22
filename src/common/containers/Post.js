import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';

import { deletePost, getPost } from '../actions/posts';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { routeToProfile } from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import { default as PostComponent } from '../components/Post';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.routerParametersSelector,
    ],
    (cacheState, postState, paramsState) => {
        let post;
        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        if (postState.get('ids').has(postId)) {
            post = retrievePost(postId, cache, ['content', 'by_profile']);
        }

        return {
            errorDetails: postState.get('errorDetails'),
            post: post,
            postId: postId,
        };
    }
);

function fetchPost({ dispatch, params }) {
    return dispatch(getPost(params.postId));
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

    handleDeletePost = (post) => {
        const { auth: { profile } } = this.context;
        this.props.dispatch(deletePost(post));
        routeToProfile(profile);
    }

    render() {
        const styles = {
            container: {
                paddingTop: '50px',
            },
            component: {
                background: '#FFF',
                borderRadius: '3px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '20px',
            },
        };

        const { errorDetails, post } = this.props;

        let content;
        if (post) {
            content = (
                <DocumentTitle title={post.title}>
                    <PostComponent
                        onDeletePost={this.handleDeletePost}
                        post={post}
                        style={styles.component}
                    />
                </DocumentTitle>
            );
        } else if (errorDetails.size) {
            content = <ErrorMessage details={errorDetails} />;
        } else  {
            content = <CenterLoadingIndicator />;
        }

        return (
            <Container style={styles.container}>
                {content}
            </Container>
        );
    }

}

Post.propTypes = {
    dispatch: PropTypes.func.isRequired,
    errorDetails: PropTypes.object,
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    }).isRequired,
    post: InternalPropTypes.PostV1,
    postId: PropTypes.string,
};

Post.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
};

export default provideHooks(hooks)(connect(selector)(Post));

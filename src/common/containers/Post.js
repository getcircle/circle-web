import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, { PropTypes } from 'react';

import { deletePost, getPost } from '../actions/posts';
import { fontColors } from '../constants/styles';

import connectData from '../utils/connectData';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { routeToPosts } from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
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

function fetchPost(dispatch, params) {
    return dispatch(getPost(params.postId));
}

function fetchData(getState, dispatch, location, params) {
    return Promise.all([fetchPost(dispatch, params)]);
}

@connectData(fetchData)
@connect(selector)
class Post extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        errorDetails: PropTypes.object,
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired,
        }).isRequired,
        post: InternalPropTypes.PostV1,
        postId: PropTypes.string,
    }

    static defaultProps = {
        errorDetails: Immutable.List(),
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        deleteRequested: false,
    }

    componentWillMount() {
        resetScroll();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.postId !== this.props.params.postId) {
            fetchPost(nextProps.dispatch, nextProps.params);
            resetScroll();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.post && nextProps.errorDetails.size === 0 && this.state.deleteRequested) {
            routeToPosts(this.context.history, PostStateURLString.LISTED);
            return false;
        }

        return super.shouldComponentUpdate(nextProps, nextState);
    }

    classes() {
        return {
            default: {
                Container: {
                    style: {
                        paddingTop: '50px',
                    },
                },
                emptyStateMessageContainer: {
                    fontSize: '16px',
                    height: '100%',
                    lineHeight: '40px',
                    minHeight: '50vh',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    ...fontColors.light,
                },
                PostComponent: {
                    style: {
                        background: '#FFF',
                        borderRadius: '3px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                    },
                },
            },
        };
    }

    onDeletePostTapped(post) {
        this.props.dispatch(deletePost(post));
        this.setState({
            deleteRequested: true,
        });
    }

    renderErrorMessage() {
        const {
            errorDetails,
        } = this.props;

        let message = '';
        errorDetails.forEach(error => {
            switch (error.detail) {
                case 'INVALID':
                case 'DOES_NOT_EXIST':
                    message = t('No knowledge post found.\nThe post has either been deleted by the author or you have an incorrect URL.');
                    break;
            }
        });

        if (message) {
            return (
                <p className="row center-xs middle-xs" style={this.styles().emptyStateMessageContainer}>
                    {message}
                </p>
            );
        }

    }

    renderPost() {
        const {
            errorDetails,
            post,
        } = this.props;
        if (post) {
            return (
                <DocumentTitle title={post.title}>
                    <PostComponent onDeletePostCallback={::this.onDeletePostTapped} post={post} {...this.styles().PostComponent} />
                </DocumentTitle>
            );
        } else if (errorDetails) {
            return this.renderErrorMessage();
        } else  {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container {...this.styles().Container} >
                {this.renderPost()}
            </Container>
        );
    }

}

export default Post;

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import connectData from '../utils/connectData';
import { deletePost, getPostsPaginationKey, getPosts } from '../actions/posts';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePosts } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import { default as PostsComponent } from '../components/Posts';
import PureComponent from '../components/PureComponent';

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
        selectors.postsSelector,
    ],
    (authenticationState, cacheState, responsiveState, parametersSelector, postsState) => {
        let posts, postsNextRequest;
        let postState = parametersSelector.postState;
        let loading = false;
        const cache = cacheState.toJS();
        const cacheKey = getPostsPaginationKey(postState, authenticationState.get('profile'));
        if (postsState.has(cacheKey)) {
            const ids = postsState.get(cacheKey).get('ids').toJS();
            posts = retrievePosts(ids, cache);
            postsNextRequest = postsState.get(cacheKey).get('nextRequest');
            loading = postsState.get(cacheKey).get('loading');
        }

        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
            loading: loading,
            postState: postState,
            posts: posts,
            postsNextRequest: postsNextRequest,
        };
    }
);

function fetchPosts(dispatch, postState, authenticatedProfile, postsNextRequest) {
    return dispatch(getPosts(postState, authenticatedProfile, postsNextRequest));
}

function fetchData(getState, dispatch, location, params) {
    const props = selector(getState(), {location, params});
    return Promise.all([
        fetchPosts(dispatch, props.postState, props.authenticatedProfile, props.postsNextRequest),
    ]);
}

@connectData(fetchData)
@connect(selector)
class Posts extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        postState: PropTypes.string.isRequired,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
        postsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
    }

    static defaultProps = {
        posts: [],
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.postState !== this.props.postState) {
            this.loadPosts(nextProps, true);
        }
    }

    loadPosts(props, shouldResetScroll) {
        fetchPosts(this.props.dispatch, props.postState, props.authenticatedProfile, props.postsNextRequest);
        if (shouldResetScroll) {
            resetScroll();
        }
    }

    onDeletePostTapped(post) {
        this.props.dispatch(deletePost(post));
    }

    onPostsLoadMore() {
        this.loadPosts(this.props, false);
    }

    renderPosts() {
        const {
            loading,
            postState,
            posts,
        } = this.props;

        let title = t('My Knowledge') + ` \u2013 `;
        if (postState === PostStateURLString.DRAFT.toString()) {
            title += t('Drafts');
        } else if (postState === PostStateURLString.LISTED.toString()) {
            title += t('Published');
        }

        return (
            <DocumentTitle title={title}>
                <PostsComponent
                    loading={loading}
                    onDeletePostCallback={::this.onDeletePostTapped}
                    postState={postState}
                    posts={posts}
                    postsLoadMore={::this.onPostsLoadMore}
                />
            </DocumentTitle>
        );
    }

    render() {
        return (
            <Container>
                {this.renderPosts()}
            </Container>
        );
    }

}

export default Posts;

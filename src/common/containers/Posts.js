import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import { deletePost, getPosts } from '../actions/posts';
import { resetScroll } from '../utils/window';
import { retrievePosts } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
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
        let postState = parametersSelector.postState
        let loading = false;
        const cache = cacheState.toJS();
        if (postsState.has(postState)) {
            const ids = postsState.get(postState).get('ids').toJS();
            posts = retrievePosts(ids, cache);
            postsNextRequest = postsState.get(postState).get('nextRequest');
            loading = postsState.get(postState).get('loading');
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

@connect(selector)
class Posts extends PureComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        loading: PropTypes.bool,
        postState: PropTypes.string.isRequired,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
        postsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    }

    static defaultProps = {
        posts: [],
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
        };
    }

    componentWillMount() {
        this.loadPosts(this.props, true);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.postState !== this.props.postState) {
            this.loadPosts(nextProps, true);
        }
    }

    loadPosts(props, shouldResetScroll) {
        this.props.dispatch(getPosts(props.postState, props.authenticatedProfile, props.postsNextRequest));
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
            largerDevice,
            loading,
            postState,
            posts,
        } = this.props;

        return (
            <PostsComponent
                largerDevice={largerDevice}
                loading={loading}
                onDeletePostCallback={::this.onDeletePostTapped}
                postState={postState}
                posts={posts}
                postsLoadMore={::this.onPostsLoadMore}
            />
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

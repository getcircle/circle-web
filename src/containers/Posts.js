import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import { getPosts } from '../actions/posts';
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
        const postState = parametersSelector.postState;
        const cache = cacheState.toJS();
        if (postsState.has(postState)) {
            const ids = postsState.get(postState).get('ids').toJS();
            posts = retrievePosts(ids, cache);
            postsNextRequest = postsState.get(postState).get('nextRequest');
        }
        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
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
        params: PropTypes.shape({
            postState: PropTypes.string,
        }),
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
        this.loadPosts(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.postState !== this.props.params.postState) {
            this.loadPosts(nextProps);
        }
    }

    loadPosts(props) {
        this.props.dispatch(getPosts(props.params.postState, props.postsNextRequest));
        resetScroll();
    }

    renderPosts() {
        const {
            largerDevice,
            params,
            posts,
        } = this.props;
        return (
            <PostsComponent
                largerDevice={largerDevice}
                postState={params.postState}
                posts={posts}
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

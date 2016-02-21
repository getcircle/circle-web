import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import t from '../utils/gettext';
import * as selectors from '../selectors';
import { getPostsPaginationKey, getPosts } from '../actions/posts';
import { getPostStateFromURLString } from '../utils/post';
import { slice } from '../reducers/paginate';
import { retrievePosts } from '../reducers/denormalizations';

import Container from '../components/Container';
import { default as PostsComponent } from '../components/PostsV2';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;
const displayStates = [LISTED, DRAFT];

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.postsSelector,
        selectors.routerParametersSelector,
    ],
    (authenticationState, cacheState, postsState, parametersState) => {
        const posts = {};
        const cache = cacheState.toJS();
        const profile = authenticationState.get('profile');
        for (let state of displayStates) {
            if (!posts[state]) { posts[state] = {} };

            const key = getPostsPaginationKey(profile.id, state);
            if (postsState.has(key)) {
                const ids = slice(postsState.get(key));
                if (ids) {
                    posts[state].posts = retrievePosts(ids.toJS(), cache);
                    posts[state].nextRequest = postsState.get(key).get('nextRequest');
                }
                posts[state].loading = postsState.get(key).get('loading');
            }
        }

        return {
            posts,
            profile,
            state: getPostStateFromURLString(parametersState.state),
        };
    },
);

const hooks = {
    defer: locals => fetchPosts(locals),
};

function fetchPosts({ dispatch, getState }) {
    const profile = getState().get('authentication').get('profile');
    for (let state of displayStates) {
        dispatch(getPosts(profile.id, state));
    }
}

class Posts extends Component {

    handleLoadMorePosts = () => {
        const { dispatch, profile, state, posts } = this.props;
        dispatch(getPosts(profile.id, state, posts[state].nextRequest));
    }

    render() {
        const { state } = this.props;
        let stateString;
        switch(state) {
        case DRAFT:
            stateString = t('Drafts');
            break;
        default:
            stateString = t('Published');
        };

        let title = `${t('My Knowledge')} \u2013 ${stateString}`;
        return (
            <Container title={title}>
                <PostsComponent
                    onLoadMore={this.handleLoadMorePosts}
                    {...this.props}
                />
            </Container>
        );

    }

}

Posts.propTypes = {
    dispatch: PropTypes.func.isRequired,
    posts: PropTypes.object,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    state: PropTypes.number.isRequired,
};

export default provideHooks(hooks)(connect(selector)(Posts));

import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import t from '../utils/gettext';
import * as selectors from '../selectors';
import { deletePost, hideConfirmDeleteModal, getPostsPaginationKey, getPosts } from '../actions/posts';
import { getPostStateFromURLString } from '../utils/post';
import { slice } from '../reducers/paginate';
import { retrievePosts } from '../reducers/denormalizations';

import Container from '../components/Container';
import DestructiveDialog from '../components/DestructiveDialog';
import { default as PostsComponent } from '../components/PostsV2';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;
const displayStates = [LISTED, DRAFT];

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.postsSelector,
        selectors.routerParametersSelector,
        selectors.myKnowledgeSelector,
    ],
    (authenticationState, cacheState, postsState, parametersState, myKnowledgeState) => {
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
            modalVisible: myKnowledgeState.get('modalVisible'),
            pendingPostToDelete: myKnowledgeState.get('pendingPostToDelete'),
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

const DeletePostConfirmation = ({ post, ...other }) => {

    const styles = {
        container: {
            padding: 30,
            fontSize: '1.4rem',
            lineHeight: '1.7rem',
        },
    };

    let dialog;
    if (post) {
        dialog = (
            <DestructiveDialog
                title={t('Delete Post')}
                {...other}
            >
                <div style={styles.container}>
                    <p>{t('Deleting a Post is final and can not be undone.')}</p>
                    <br />
                    <p>{t('Are you sure you want to delete post: ')}<b>{post.title}</b>{'?'}</p>
                </div>
            </DestructiveDialog>
        );
    }
    return (
        <div>
            {dialog}
        </div>
    );
};

class Posts extends Component {

    handleLoadMorePosts = () => {
        const { dispatch, profile, state, posts } = this.props;
        dispatch(getPosts(profile.id, state, posts[state].nextRequest));
    }

    handleRequestClose = () => {
        this.props.dispatch(hideConfirmDeleteModal());
    }

    handleSave = () => {
        const { dispatch, pendingPostToDelete } = this.props;
        dispatch(hideConfirmDeleteModal());
        dispatch(deletePost(pendingPostToDelete));
    }

    render() {
        const { modalVisible, pendingPostToDelete, state } = this.props;
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
                <DeletePostConfirmation
                    onRequestClose={this.handleRequestClose}
                    onSave={this.handleSave}
                    open={modalVisible}
                    post={pendingPostToDelete}
                />
            </Container>
        );

    }

}

Posts.propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalVisible: PropTypes.bool,
    pendingPostToDelete: PropTypes.instanceOf(services.post.containers.PostV1),
    posts: PropTypes.object,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    state: PropTypes.number.isRequired,
};

export default provideHooks(hooks)(connect(selector)(Posts));

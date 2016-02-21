import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';
import { merge } from 'lodash';

import t from '../utils/gettext';
import * as selectors from '../selectors';
import {
    deletePost,
    hideConfirmDeleteModal,
    getDraftPostsPaginationKey,
    getDraftPosts,
} from '../actions/posts';
import { slice } from '../reducers/paginate';
import { retrievePosts } from '../reducers/denormalizations';

import Container from '../components/Container';
import DeletePostConfirmation from '../components/DeletePostConfirmation';
import { default as DraftPostsComponent } from '../components/DraftPosts';
import Header from '../components/Header';

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.postsSelector,
        selectors.routerParametersSelector,
        selectors.draftsSelector,
    ],
    (authenticationState, cacheState, postsState, parametersState, draftsState) => {
        let loaded, loading, posts, nextRequest;
        const cache = cacheState.toJS();
        const profile = authenticationState.get('profile');
        const key = getDraftPostsPaginationKey(profile.id);
        if (postsState.has(key)) {
            const ids = slice(postsState.get(key));
            if (ids.size) {
                posts = retrievePosts(ids.toJS(), cache);
                nextRequest = postsState.get(key).get('nextRequest');
            }
            loaded = postsState.get(key).get('loaded');
            loading = postsState.get(key).get('loading');
        }

        return {
            loaded,
            loading,
            nextRequest,
            posts,
            profile,
            modalVisible: draftsState.get('modalVisible'),
            pendingPostToDelete: draftsState.get('pendingPostToDelete'),
        };
    },
);

const hooks = {
    defer: locals => fetchPosts(locals),
};

function fetchPosts({ dispatch, getState }) {
    const profile = getState().get('authentication').get('profile');
    dispatch(getDraftPosts(profile.id));
}

class DraftPosts extends Component {

    state = {
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.state);
    }

    comonentWillReceiveProps(nextProps, nextState) {
        this.customizeTheme(nextState);
    }

    customizeTheme(state) {
        const muiTheme = merge({}, state.muiTheme);
        muiTheme.paper.backgroundColor = muiTheme.luno.colors.offWhite;
        muiTheme.appBar.color = muiTheme.luno.colors.offWhite;
        this.setState({muiTheme});
    }

    handleLoadMore = () => {
        const { dispatch, profile, nextRequest } = this.props;
        dispatch(getDraftPosts(profile.id, nextRequest));
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
        const { dispatch, modalVisible, pendingPostToDelete } = this.props;
        const { muiTheme } = this.context;
        const styles = {
            root: {
                backgroundColor: muiTheme.luno.colors.offWhite,
                height: '100%',
                width: '100%',
            },
        };
        return (
            <Container style={styles.root} title={t('My Drafts')}>
                <Header appBarStyle={{boxShadow: 'none'}} dispatch={dispatch} />
                <DraftPostsComponent
                    onLoadMore={this.handleLoadMore}
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

DraftPosts.propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalVisible: PropTypes.bool,
    nextRequest: PropTypes.object,
    pendingPostToDelete: PropTypes.instanceOf(services.post.containers.PostV1),
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

DraftPosts.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

DraftPosts.childContextTypes = {
    muiTheme: PropTypes.object,
};

export default provideHooks(hooks)(connect(selector)(DraftPosts));

import { merge } from 'lodash';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';

import { getPost } from '../actions/posts';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import PostEditor from '../components/PostEditorV2';

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
            post: post,
        };
    }
);

function fetchPost({ dispatch, params }) {
    return dispatch(getPost(params.postId));
}

const hooks = {
    fetch: locals => fetchPost(locals),
};

class EditPost extends Component {

    componentWillMount() {
        resetScroll();
    }

    componentWillReceiveProps(nextProps) {
        // TODO redirect to view post if current user doesn't have permission
        if (nextProps.params.postId !== this.props.params.postId) {
            fetchPost(nextProps);
            resetScroll();
        }
    }

    render() {
        const { post } = this.props;
        const { auth: { profile }, muiTheme } = this.context;

        let content;
        if (post) {
            content = (
                <DocumentTitle title={post.title}>
                    <PostEditor
                        post={post}
                        profile={profile}
                    />
                </DocumentTitle>
            );
        } else  {
            content = <CenterLoadingIndicator />;
        }

        const style = merge({paddingTop: '10px'}, muiTheme.luno.managePage.container);
        return (
            <Container style={style}>
                {content}
            </Container>
        );
    }

}

EditPost.propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    }).isRequired,
    post: InternalPropTypes.PostV1,
};

EditPost.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

export default provideHooks(hooks)(connect(selector)(EditPost));

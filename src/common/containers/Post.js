import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

import { canvasColor } from '../constants/styles';
import CurrentTheme from '../utils/ThemeManager';
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
        errorDetails: {},
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.configure(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.postId !== this.props.params.postId) {
            fetchPost(nextProps.dispatch, nextProps.params);
            this.configure(nextProps);
        }
    }

    classes() {
        return {
            default: {
                emptyStateMessageContainer: {
                    fontSize: '16px',
                    height: '100%',
                    lineHeight: '40px',
                    minHeight: '50vh',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    ...fontColors.light,
                },
            },
        };
    }

    configure(props) {
        resetScroll();
        this.customizeTheme();
    }

    customizeTheme() {
        let customTheme = JSON.parse(JSON.stringify(CurrentTheme));
        customTheme.flatButton.color = canvasColor;
        this.setState({muiTheme: customTheme});
    }

    onDeletePostTapped(post) {
        this.props.dispatch(deletePost(post));
        routeToPosts(this.context.history, PostStateURLString.LISTED);
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
                    <PostComponent onDeletePostCallback={::this.onDeletePostTapped} post={post} />
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
            <Container>
                {this.renderPost()}
            </Container>
        );
    }

}

export default Post;

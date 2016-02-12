import { Tabs, Tab } from 'material-ui';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';
import { provideHooks } from 'redial';

import { deletePost, getPostsPaginationKey, getPosts } from '../actions/posts';
import { fontColors, fontWeights } from '../constants/styles';
import { PostStateURLString } from '../utils/post';
import { resetScroll } from '../utils/window';
import { retrievePosts } from '../reducers/denormalizations';
import { routeToPosts } from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CardRow from '../components/CardRow';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DetailContent from '../components/DetailContent';
import DocumentTitle from '../components/DocumentTitle';
import { default as PostsComponent } from '../components/Posts';

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

const hooks = {
    fetch: ({getState, dispatch, location, params}) => {
        const props = selector(getState(), {location, params});
        return fetchPosts(dispatch, props.postState, props.authenticatedProfile, props.postsNextRequest);
    },
}

@provideHooks(hooks)
@connect(selector)
class Posts extends CSSComponent {

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

    classes() {
        return {
            default: {
                pageHeaderContainer: {
                    padding: '10px 0 50px 0',
                    width: '100%',
                },
                pageHeaderText: {
                    fontSize: 36,
                    fontWeight: 300,
                    ...fontColors.dark,
                },
                tabsContainer: {
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    width: '100%',
                },
                tabInkBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    height: 1,
                },
                tab: {
                    fontSize: 12,
                    letterSpacing: '1px',
                    padding: '0 25px',
                    textTransform: 'uppercase',
                    ...fontWeights.semiBold,
                },
            },
        };
    }

    onDeletePostTapped(post) {
        this.props.dispatch(deletePost(post));
    }

    onPostsLoadMore() {
        this.loadPosts(this.props, false);
    }

    onTabChange(value, event, tab) {
        routeToPosts(value);
    }

    renderPosts() {
        const {
            loading,
            postState,
            posts,
        } = this.props;

        let title = t('My Knowledge') + ' \u2013 ';
        if (postState === PostStateURLString.DRAFT.toString()) {
            title += t('Drafts');
        } else if (postState === PostStateURLString.LISTED.toString()) {
            title += t('Published');
        }

        return (
            <DocumentTitle title={title}>
                <DetailContent>
                    <CardRow>
                        <div className="row start-xs between-xs" style={this.styles().pageHeaderContainer}>
                            <div>
                                <h3 style={this.styles().pageHeaderText}>{t('My Knowledge')}</h3>
                            </div>
                        </div>
                        <div className="row" style={this.styles().tabsContainer}>
                            <Tabs
                                inkBarStyle={{...this.styles().tabInkBarStyle}}
                                valueLink={{value: postState, requestChange: this.onTabChange.bind(this)}}
                            >
                                <Tab
                                    label={t('Published')}
                                    style={{...this.styles().tab}}
                                    value={PostStateURLString.LISTED.toString()}
                                />
                                <Tab
                                    label={t('Drafts')}
                                    style={{...this.styles().tab}}
                                    value={PostStateURLString.DRAFT.toString()}
                                />
                            </Tabs>
                        </div>
                        <PostsComponent
                            loading={loading}
                            onDeletePostCallback={::this.onDeletePostTapped}
                            postState={postState}
                            posts={posts}
                            postsLoadMore={::this.onPostsLoadMore}
                            showEditDelete={true}
                        />
                    </CardRow>
                </DetailContent>
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

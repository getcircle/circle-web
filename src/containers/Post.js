import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor } from '../constants/styles';
import CurrentTheme from '../utils/ThemeManager';
import { getPost } from '../actions/posts';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import { default as PostComponent } from '../components/Post';

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.postSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
    ],
    (authenticationState, cacheState, postState, responsiveState, paramsState) => {
        let post;
        const postId = paramsState.postId;
        const cache = cacheState.toJS();
        if (postState.get('ids').has(postId)) {
            post = retrievePost(postId, cache);
        }

        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            post: post,
            postId: postId,
            organization: authenticationState.get('organization'),
        };
    }
);

@connect(selector)
class Post extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired,
        }).isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
        postId: PropTypes.string,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mobileOS: PropTypes.bool.isRequired,
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            mobileOS: this.props.mobileOS,
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.loadPost(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.postId !== this.props.params.postId) {
            this.loadPost(nextProps);
        }
    }

    classes() {
        return {
            default: {
            },
        };
    }

    loadPost(props) {
        this.props.dispatch(getPost(props.params.postId));
        resetScroll();
        this.customizeTheme();
    }

    customizeTheme() {
        let customTheme = JSON.parse(JSON.stringify(CurrentTheme));
        customTheme.flatButton.color = canvasColor;
        this.setState({muiTheme: customTheme});
    }

    renderPost() {
        const {
            largerDevice,
            post,
        } = this.props;
        if (post) {
            return (
                <PostComponent
                    largerDevice={largerDevice}
                    post={post}
                />
            );
        } else {
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

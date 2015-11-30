import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor } from '../constants/styles';
import CurrentTheme from '../utils/ThemeManager';
import { fontColors } from '../constants/styles';
import { getPost } from '../actions/posts';

import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import t from '../utils/gettext';

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
            errorDetails: postState.get('errorDetails'),
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
        errorDetails: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired,
        }).isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
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
                emptyStateMessageContainer: {
                    height: '100%',
                    lineHeight: '25px',
                    minHeight: '50vh',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    ...fontColors.light,
                },
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

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor, fontColors } from '../constants/styles';
import CurrentTheme from '../utils/ThemeManager';
import { getPost } from '../actions/posts';
import { mailtoSharePost } from '../utils/contact';
import { resetScroll } from '../utils/window';
import { retrievePost } from '../reducers/denormalizations';
import { routeToEditPost } from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import { default as PostComponent } from '../components/Post';
import RoundedButton from '../components/RoundedButton';

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

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

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
        voted: false,
        votedMessageShown: false,
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
                headerContainer: {
                    width: '100%',
                },
                FeedbackButton: {
                    labelStyle: {
                        ...fontColors.dark,
                        fontSize: 16,
                        textTransform: 'none',
                    },
                },
                feedbackButtonSeparator: {
                    ...fontColors.dark,
                    padding: '0 5px',
                },
                feedbackConfirmation: {
                    ...fontColors.light,
                    fontSize: 14,
                    padding: '0 20px',
                },
                ShareButton: {
                    style: {
                        marginLeft: '20px',
                    },
                },
            },
        };
    }

    loadPost(props) {
        this.props.dispatch(getPost(props.params.postId));
        resetScroll();
        this.customizeTheme();
        this.setState({
            voted: false,
            votedMessageShown: false,
        });
    }

    customizeTheme() {
        let customTheme = JSON.parse(JSON.stringify(CurrentTheme));
        customTheme.flatButton.color = canvasColor;
        this.setState({muiTheme: customTheme});
    }

    recordFeedback() {
        this.setState({
            voted: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    votedMessageShown: true,
                });
            }, 2000);
        });
    }

    renderShareButton(post) {
        return (
            <RoundedButton
                className="center-xs"
                href={mailtoSharePost(post, this.props.authenticatedProfile)}
                is="ShareButton"
                label={t('Share')}
                linkButton={true}
                target="_blank"
            />
        );
    }

    renderHeader() {
        const {
            post
        } = this.props;

        if (post && post.permissions && post.permissions.can_edit) {
            return (
                <div className="row end-xs" is="headerContainer">
                    <RoundedButton
                        label={t('Edit')}
                        onTouchTap={routeToEditPost.bind(null, this.context.router, post)}
                    />
                </div>
            );
        }

        return (
            <div className="row middle-xs end-xs" is="headerContainer">
                {this.renderShareButton(post)}
            </div>
        );
    }

    renderPost() {
        const {
            largerDevice,
            post,
        } = this.props;
        if (post) {
            return (
                <PostComponent
                    header={this.renderHeader()}
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

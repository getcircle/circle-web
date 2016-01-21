import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { soa } from 'protobufs';

import { getExtendedProfile, updateProfile } from '../actions/profiles';
import { getPostsPaginationKey, getPosts } from '../actions/posts';
import { PostStateURLString } from '../utils/post';
import { clearTeamMembers } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveExtendedProfile, retrievePosts } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import ProfileDetail from '../components/ProfileDetail';
import { PROFILE_TAB_VALUES } from '../components/ProfileDetail';
import PureComponent from '../components/PureComponent';

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.extendedProfilesSelector,
        selectors.postsSelector,
        selectors.routerParametersSelector,
    ],
    (authenticationState, cacheState, extendedProfilesState, postsState, paramsState) => {
        const slug = paramsState.slug ? paramsState.slug : PROFILE_TAB_VALUES.ABOUT;

        let extendedProfile;
        const profileId = paramsState.profileId;
        const cache = cacheState.toJS();
        if (extendedProfilesState.get('ids').has(profileId)) {
            extendedProfile = retrieveExtendedProfile(profileId, cache);
        }

        const authenticatedProfile = authenticationState.get('profile');
        let isLoggedInUser;
        if (authenticatedProfile && authenticatedProfile.id === profileId) {
            isLoggedInUser = true;
        } else {
            isLoggedInUser = false;
        }

        let posts, postsNextRequest;
        let postState = PostStateURLString.LISTED;
        const cacheKey = getPostsPaginationKey(postState, {id: profileId});
        if (postsState.has(cacheKey)) {
            const ids = postsState.get(cacheKey).get('ids').toJS();
            posts = retrievePosts(ids, cache);
            postsNextRequest = postsState.get(cacheKey).get('nextRequest');
        }

        // Profile ID is passed because extended profile might not have been fetched
        // ID is used to check whether this user is the logged in user or not
        return {
            extendedProfile,
            isLoggedInUser,
            posts,
            postsNextRequest,
            profileId,
            slug,
        };
    }
);

function fetchPosts(dispatch, params, postsNextRequest) {
    return dispatch(getPosts(PostStateURLString.LISTED, {id: params.profileId}, postsNextRequest));
}

function fetchProfile(dispatch, params) {
    return dispatch(getExtendedProfile(params.profileId));
}

function fetchData(getState, dispatch, location, params) {
    return Promise.all([
        fetchProfile(dispatch, params),
        fetchPosts(dispatch, params, null),
    ]);
}

@connectData(fetchData)
@connect(selector)
class Profile extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
        isLoggedInUser: PropTypes.bool.isRequired,
        params: PropTypes.shape({
            profileId: PropTypes.string.isRequired,
            slug: PropTypes.string,
        }).isRequired,
        posts: PropTypes.arrayOf(
            InternalPropTypes.PostV1,
        ),
        postsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            fetchProfile(this.props.dispatch, this.props.params);
            fetchPosts(this.props.dispatch, this.props.params, this.props.postsNextRequest);
            resetScroll();
        }
        else if (this.props.extendedProfile && nextProps.extendedProfile) {
            if (this.props.extendedProfile.team &&
                nextProps.extendedProfile.team &&
                nextProps.extendedProfile.team.id !== this.props.extendedProfile.team.id) {
                // When user switches teams, clear cached team members for old & new team
                nextProps.dispatch(clearTeamMembers(this.props.extendedProfile.team.id));
                nextProps.dispatch(clearTeamMembers(nextProps.extendedProfile.team.id));
            }
        }
    }

    onPostsLoadMore() {
        const {
            dispatch,
            params,
            postsNextRequest,
        } = this.props;

        fetchPosts(dispatch, params, postsNextRequest);
    }

    onUpdateProfile(profile, manager) {
        if (manager !== this.props.extendedProfile.manager) {
            this.props.dispatch(updateProfile(profile, manager));
        } else {
            this.props.dispatch(updateProfile(profile));
        }
    }

    renderProfile() {
        const {
            extendedProfile,
            isLoggedInUser,
            posts,
            postsNextRequest,
            slug,
        } = this.props;

        let totalPosts = posts ? posts.length : 0;
        if (postsNextRequest && postsNextRequest.actions[0]) {
            totalPosts = postsNextRequest.actions[0].control.paginator.count;
        }

        if (extendedProfile) {
            return (
                <DocumentTitle title={extendedProfile.profile.full_name}>
                    <ProfileDetail
                        extendedProfile={extendedProfile}
                        isLoggedInUser={isLoggedInUser}
                        onUpdateProfile={::this.onUpdateProfile}
                        posts={posts}
                        postsLoadMore={::this.onPostsLoadMore}
                        slug={slug}
                        totalPosts={totalPosts}
                    />
                </DocumentTitle>
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this.renderProfile()}
            </Container>
        );
    }

}

export default Profile;

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { getProfile, getReportingDetails } from '../actions/profiles';
import { getListedPosts, getListedPostsPaginationKey } from '../actions/posts';
import { getMembersForProfileId } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { slice } from '../reducers/paginate';
import { retrieveProfile, retrieveReportingDetails, retrievePosts, retrieveTeamMembers } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import ProfileDetail from '../components/ProfileDetailV2';

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.profileMembershipsSelector,
        selectors.postsSelector,
    ],
    (authenticationState, cacheState, parametersState, membershipsState, postsState) => {
        let memberships, posts, postsLoading, postsNextRequest;

        const { profileId } = parametersState;
        const cache = cacheState.toJS();
        const profile = retrieveProfile(profileId, cache);
        const authenticatedProfile = authenticationState.get('profile');
        let isLoggedInUser;
        if (authenticatedProfile && authenticatedProfile.id === profileId) {
            isLoggedInUser = true;
        } else {
            isLoggedInUser = false;
        }

        const reportingDetails = retrieveReportingDetails(profileId, cache);
        if (membershipsState.has(profileId)) {
            const ids = membershipsState.get(profileId).get('ids');
            if (ids.size) {
                // TODO: support Immutable
                memberships = retrieveTeamMembers(ids.toJS(), cache);
            }
        }

        const key = getListedPostsPaginationKey(profileId);
        if (postsState.has(key)) {
            const ids = slice(postsState.get(key));
            if (ids.size) {
                // TODO: support Immutable
                posts = retrievePosts(ids.toJS(), cache);
                postsNextRequest = postsState.get(key).get('nextRequest');
            }
            postsLoading = postsState.get(key).get('loading');
        }

        return {
            isLoggedInUser,
            memberships,
            posts,
            postsLoading,
            postsNextRequest,
            profile,
            reportingDetails,
        };
    },
);

const hooks = {
    fetch: (locals) => {
        // XXX this should defer based on which slug we're loading
        return Promise.all([
            fetchProfile(locals),
            fetchPosts(locals),
        ]);
    },
    defer: (locals) => {
        fetchReportingDetails(locals);
        fetchMemberships(locals);
    },
};

function fetchProfile({ dispatch, params: { profileId }}) {
    return dispatch(getProfile(profileId));
}

function fetchReportingDetails({ dispatch, params: { profileId }}) {
    return dispatch(getReportingDetails(profileId));
}

function fetchMemberships({ dispatch, params: { profileId }}) {
    return dispatch(getMembersForProfileId(profileId));
}

function fetchPosts({ dispatch, params: { profileId }}) {
    return dispatch(getListedPosts(profileId));
}

function loadProfile(locals) {
    fetchProfile(locals);
    fetchReportingDetails(locals);
    fetchMemberships(locals);
    fetchPosts(locals);
}

class Profile extends CSSComponent {

    static propTypes = {
        params: PropTypes.shape({
            slug: PropTypes.string,
            profileId: PropTypes.string.isRequired,
        }),
        posts: PropTypes.array,
        postsLoading: PropTypes.bool,
        postsNextRequest: PropTypes.object,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        reportingDetails: PropTypes.instanceOf(services.profile.containers.ReportingDetailsV1),
    }

    static defaultProps = {
        postsLoading: false,
    }

    handleLoadMorePosts = () => {
        const { dispatch, params: { profileId }, postsNextRequest } = this.props;
        dispatch(getListedPosts(profileId, postsNextRequest));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            resetScroll();
            loadProfile(nextProps);
        }
    }

    render() {
        let directReports, manager, peers;
        const { profile, reportingDetails, params: { slug } } = this.props;
        if (reportingDetails) {
            directReports = reportingDetails.direct_reports;
            manager = reportingDetails.manager;
            peers = reportingDetails.peers;
        }
        const title = profile ? profile.full_name : null;
        return (
            <Container title={title}>
                <ProfileDetail
                    directReports={directReports}
                    hasMorePosts={!!this.props.postsNextRequest}
                    manager={manager}
                    onLoadMorePosts={this.handleLoadMorePosts}
                    peers={peers}
                    slug={slug}
                    {...this.props}
                />
            </Container>
        );
    }
}

export { Profile };
export default provideHooks(hooks)(connect(selector)(Profile));

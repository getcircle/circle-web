import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { getCollectionsForOwner } from '../actions/collections';
import { getProfile, getReportingDetails } from '../actions/profiles';
import {
    deletePost,
    hideConfirmDeleteModal,
    getListedPosts,
    getListedPostsPaginationKey,
} from '../actions/posts';
import { getCollectionsForOwnerKey } from '../services/posts';
import { getMembersForProfileId } from '../actions/teams';
import { getPaginator } from '../services/helpers';
import { resetScroll } from '../utils/window';
import { slice } from '../reducers/paginate';
import {
    retrieveCollections,
    retrieveProfile,
    retrieveReportingDetails,
    retrievePosts,
    retrieveTeamMembers,
} from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DeletePostConfirmation from '../components/DeletePostConfirmation';
import ProfileDetail from '../components/ProfileDetailV2';

const { PROFILE } = services.post.containers.CollectionV1.OwnerTypeV1;

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.profileMembershipsSelector,
        selectors.postsSelector,
        selectors.deletePostSelector,
        selectors.collectionsSelector,
    ],
    (cacheState, parametersState, membershipsState, postsState, deletePostState, collectionsState) => {
        let collections,
            collectionsCount,
            collectionsLoaded,
            collectionsLoading,
            collectionsNextRequest,
            defaultCollection,
            defaultCollectionLoaded,
            memberships,
            posts,
            postsCount,
            postsLoaded,
            postsLoading,
            postsNextRequest;

        const { profileId } = parametersState;
        const cache = cacheState.toJS();
        const profile = retrieveProfile(profileId, cache);

        const reportingDetails = retrieveReportingDetails(profileId, cache);
        if (membershipsState.has(profileId)) {
            const ids = membershipsState.get(profileId).get('ids');
            if (ids.size) {
                // TODO: support Immutable
                memberships = retrieveTeamMembers(ids.toJS(), cache);
            }
        }

        const postsKey = getListedPostsPaginationKey(profileId);
        if (postsState.has(postsKey)) {
            const ids = slice(postsState.get(postsKey));
            if (ids.size) {
                // TODO: support Immutable
                posts = retrievePosts(ids.toJS(), cache);
                postsNextRequest = postsState.get(postsKey).get('nextRequest');
                postsCount = postsNextRequest ? getPaginator(postsNextRequest).count : posts.length;
            }
            postsLoading = postsState.get(postsKey).get('loading');
            postsLoaded = postsState.get(postsKey).get('loaded');
        }

        const collectionsKey = getCollectionsForOwnerKey(PROFILE, profileId);
        if (collectionsState.has(collectionsKey)) {
            const ids = collectionsState.get(collectionsKey).get('ids');
            if (ids.size) {
                collections = retrieveCollections(ids.toJS(), cache);
                collectionsNextRequest = collectionsState.get(collectionsKey).get('nextRequest');
                collectionsCount = collectionsNextRequest ? getPaginator(collectionsNextRequest).count : collections.length;
            }
            collectionsLoading = collectionsState.get(collectionsKey).get('loading');
            collectionsLoaded = collectionsState.get(collectionsKey).get('loaded');
        }

        const defaultCollectionKey = getCollectionsForOwnerKey(PROFILE, profileId, true);
        if (collectionsState.has(defaultCollectionKey)) {
            const ids = collectionsState.get(defaultCollectionKey).get('ids');
            if (ids.size) {
                defaultCollection = retrieveCollections(ids.toJS(), cache)[0];
            }
            defaultCollectionLoaded = collectionsState.get(defaultCollectionKey).get('loaded');
        }

        return {
            defaultCollection,
            defaultCollectionLoaded,
            collections,
            collectionsCount,
            collectionsLoaded,
            collectionsLoading,
            collectionsNextRequest,
            memberships,
            posts,
            postsCount,
            postsLoaded,
            postsLoading,
            postsNextRequest,
            profile,
            reportingDetails,
            modalVisible: deletePostState.get('modalVisible'),
            pendingPostToDelete: deletePostState.get('pendingPostToDelete'),
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
        fetchCollections(locals);
        fetchDefaultCollection(locals);
    },
};

function fetchProfile({ dispatch, params: { profileId } }) {
    return dispatch(getProfile(profileId));
}

function fetchReportingDetails({ dispatch, params: { profileId } }) {
    return dispatch(getReportingDetails(profileId));
}

function fetchMemberships({ dispatch, params: { profileId } }) {
    return dispatch(getMembersForProfileId(profileId));
}

function fetchPosts({ dispatch, params: { profileId } }) {
    return dispatch(getListedPosts(profileId));
}

function fetchCollections({ dispatch, params: { profileId } }) {
    return dispatch(getCollectionsForOwner(PROFILE, profileId));
}

function fetchDefaultCollection({ dispatch, params: { profileId } }) {
    return dispatch(getCollectionsForOwner(PROFILE, profileId, true));
}

function loadProfile(locals) {
    fetchProfile(locals);
    fetchReportingDetails(locals);
    fetchMemberships(locals);
    fetchPosts(locals);
    fetchCollections(locals);
    fetchDefaultCollection(locals);
}

class Profile extends CSSComponent {

    handleLoadMorePosts = () => {
        const { dispatch, params: { profileId }, postsNextRequest } = this.props;
        dispatch(getListedPosts(profileId, postsNextRequest));
    }

    handleLoadMoreCollections = () => {
        const { dispatch, params: { profileId }, collectionsNextRequest } = this.props;
        dispatch(getCollectionsForOwner(PROFILE, profileId, undefined, collectionsNextRequest));
    }

    handleRequestClose = () => {
        this.props.dispatch(hideConfirmDeleteModal());
    }

    handleSave = () => {
        const { dispatch, pendingPostToDelete } = this.props;
        dispatch(hideConfirmDeleteModal());
        dispatch(deletePost(pendingPostToDelete));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            resetScroll();
            loadProfile(nextProps);
        }
    }

    render() {
        let directReports, manager, peers;
        const { modalVisible, pendingPostToDelete, profile, reportingDetails, params: { slug } } = this.props;
        const { auth } = this.context;

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
                    hasMoreCollections={!!this.props.collectionsNextRequest}
                    hasMorePosts={!!this.props.postsNextRequest}
                    manager={manager}
                    onLoadMoreCollections={this.handleLoadMoreCollections}
                    onLoadMorePosts={this.handleLoadMorePosts}
                    peers={peers}
                    slug={slug}
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

Profile.propTypes = {
    collections: PropTypes.array,
    collectionsCount: PropTypes.number,
    collectionsLoaded: PropTypes.bool,
    collectionsLoading: PropTypes.bool,
    collectionsNextRequest: PropTypes.object,
    defaultCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    defaultCollectionLoaded: PropTypes.bool,
    modalVisible: PropTypes.bool,
    params: PropTypes.shape({
        slug: PropTypes.string,
        profileId: PropTypes.string.isRequired,
    }),
    pendingPostToDelete: PropTypes.instanceOf(services.post.containers.PostV1),
    posts: PropTypes.array,
    postsCount: PropTypes.number,
    postsLoaded: PropTypes.bool,
    postsLoading: PropTypes.bool,
    postsNextRequest: PropTypes.object,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    reportingDetails: PropTypes.instanceOf(services.profile.containers.ReportingDetailsV1),
};

Profile.defaultProps = {
    collectionsCount: 0,
    collectionsLoaded: false,
    collectionsLoading: false,
    postsCount: 0,
    postsLoading: false,
};

export { Profile };
export default provideHooks(hooks)(connect(selector)(Profile));

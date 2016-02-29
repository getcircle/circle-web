import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { replaceProfileSlug } from '../utils/routes';

import InternalPropTypes from '../components/InternalPropTypes';
import DetailContent from './DetailContent';
import ProfileDetailHeader from './ProfileDetailHeaderV2';
import ProfileDetailTabs, { SLUGS } from './ProfileDetailTabs';
import ProfileDetailAbout from './ProfileDetailAbout';
import ProfileDetailCollections from './ProfileDetailCollections';
import ProfileDetailKnowledge from './ProfileDetailKnowledge';

const ProfileDetail = (props, { auth }) => {
    const {
        collections,
        collectionsCount,
        collectionsLoaded,
        collectionsLoading,
        defaultCollection,
        defaultCollectionLoaded,
        dispatch,
        directReports,
        hasMoreCollections,
        hasMorePosts,
        manager,
        memberships,
        onLoadMoreCollections,
        onLoadMorePosts,
        peers,
        posts,
        postsCount,
        postsLoaded,
        postsLoading,
        profile,
        slug,
    } = props;

    let isAdmin, isLoggedInUser;
    if (profile && auth) {
        isLoggedInUser = profile.id === auth.profile.id;
        isAdmin = auth.profile.is_admin;
    }

    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = (
            <ProfileDetailAbout
                directReports={directReports}
                dispatch={dispatch}
                isAdmin={isAdmin}
                isLoggedInUser={isLoggedInUser}
                manager={manager}
                memberships={memberships}
                peers={peers}
                profile={profile}
            />
        );
        break;
    case SLUGS.KNOWLEDGE:
        content = (
            <ProfileDetailKnowledge
                hasMorePosts={hasMorePosts}
                isAdmin={isAdmin}
                isLoggedInUser={isLoggedInUser}
                onLoadMorePosts={onLoadMorePosts}
                posts={posts}
                postsCount={postsCount}
                postsLoaded={postsLoaded}
                postsLoading={postsLoading}
            />
        );
        break;
    case SLUGS.COLLECTIONS:
        content = (
            <ProfileDetailCollections
                collections={collections}
                collectionsCount={collectionsCount}
                defaultCollection={defaultCollection}
                defaultCollectionLoaded={defaultCollectionLoaded}
                hasMore={hasMoreCollections}
                isAdmin={isAdmin}
                isLoggedInUser={isLoggedInUser}
                loaded={collectionsLoaded}
                loading={collectionsLoading}
                onLoadMore={onLoadMoreCollections}
                profile={profile}
            />
        );
        break;
    }

    return (
        <div>
            <ProfileDetailHeader profile={profile} />
            <ProfileDetailTabs
                collectionsCount={collectionsCount}
                onRequestChange={replaceProfileSlug}
                postsCount={postsCount}
                profile={profile}
                slug={slug}
            />
            <DetailContent>
                {content}
            </DetailContent>
        </div>
    );
};

ProfileDetail.propTypes = {
    canEdit: PropTypes.bool,
    collections: PropTypes.array,
    collectionsCount: PropTypes.number,
    collectionsLoaded: PropTypes.bool,
    collectionsLoading: PropTypes.bool,
    defaultCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    defaultCollectionLoaded: PropTypes.bool,
    directReports: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    hasMoreCollections: PropTypes.bool.isRequired,
    hasMorePosts: PropTypes.bool.isRequired,
    manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    memberships: PropTypes.array,
    onLoadMoreCollections: PropTypes.func,
    onLoadMorePosts: PropTypes.func,
    peers: PropTypes.array,
    posts: PropTypes.array,
    postsCount: PropTypes.number,
    postsLoaded: PropTypes.bool,
    postsLoading: PropTypes.bool,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    reportingDetails: PropTypes.instanceOf(services.profile.containers.ReportingDetailsV1),
    slug: PropTypes.oneOf(Object.values(SLUGS)),
};

ProfileDetail.defaultProps = {
    slug: SLUGS.KNOWLEDGE,
};

ProfileDetail.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
};

export default ProfileDetail;

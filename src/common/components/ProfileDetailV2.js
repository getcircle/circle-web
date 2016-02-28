import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { replaceProfileSlug } from '../utils/routes';

import DetailContent from './DetailContent';
import ProfileDetailHeader from './ProfileDetailHeaderV2';
import ProfileDetailTabs, { SLUGS } from './ProfileDetailTabs';
import ProfileDetailAbout from './ProfileDetailAbout';
import ProfileDetailCollections from './ProfileDetailCollections';
import ProfileDetailKnowledge from './ProfileDetailKnowledge';

const ProfileDetail = (props) => {
    const {
        defaultCollection,
        defaultCollectionLoaded,
        collections,
        collectionsLoaded,
        collectionsLoading,
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
        postsLoaded,
        postsLoading,
        profile,
        slug,
    } = props;

    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = (
            <ProfileDetailAbout
                directReports={directReports}
                dispatch={dispatch}
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
                onLoadMorePosts={onLoadMorePosts}
                posts={posts}
                postsLoaded={postsLoaded}
                postsLoading={postsLoading}
            />
        );
        break;
    case SLUGS.COLLECTIONS:
        content = (
            <ProfileDetailCollections
                collections={collections}
                defaultCollection={defaultCollection}
                defaultCollectionLoaded={defaultCollectionLoaded}
                hasMore={hasMoreCollections}
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
                onRequestChange={replaceProfileSlug}
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
    collections: PropTypes.array,
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
    postsLoaded: PropTypes.bool,
    postsLoading: PropTypes.bool,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    reportingDetails: PropTypes.instanceOf(services.profile.containers.ReportingDetailsV1),
    slug: PropTypes.oneOf(Object.values(SLUGS)),
};

ProfileDetail.defaultProps = {
    slug: SLUGS.COLLECTIONS,
};

export default ProfileDetail;

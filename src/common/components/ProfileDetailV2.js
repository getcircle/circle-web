import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { replaceProfileSlug } from '../utils/routes';

import DetailContent from './DetailContent';
import ProfileDetailHeader from './ProfileDetailHeaderV2';
import ProfileDetailTabs, { SLUGS } from './ProfileDetailTabs';
import ProfileDetailAbout from './ProfileDetailAbout';
import ProfileDetailKnowledge from './ProfileDetailKnowledge';

const ProfileDetail = (props) => {
    const {
        dispatch,
        directReports,
        hasMorePosts,
        isLoggedInUser,
        manager,
        memberships,
        peers,
        posts,
        postsLoading,
        profile,
        onLoadMorePosts,
        slug,
    } = props;

    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = (
            <ProfileDetailAbout
                dispatch={dispatch}
                directReports={directReports}
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
                onLoadMorePosts={onLoadMorePosts}
                posts={posts}
                postsLoading={postsLoading}
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
    directReports: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    hasMorePosts: PropTypes.bool.isRequired,
    isLoggedInUser: PropTypes.bool.isRequired,
    manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    memberships: PropTypes.array,
    onLoadMorePosts: PropTypes.func,
    peers: PropTypes.array,
    posts: PropTypes.array,
    postsLoading: PropTypes.bool,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    reportingDetails: PropTypes.instanceOf(services.profile.containers.ReportingDetailsV1),
    slug: PropTypes.oneOf(Object.values(SLUGS)),
};

ProfileDetail.defaultProps = {
    slug: SLUGS.KNOWLEDGE,
};

export default ProfileDetail;

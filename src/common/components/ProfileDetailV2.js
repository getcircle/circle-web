import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailContent from './DetailContent';
import ProfileDetailHeader from './ProfileDetailHeaderV2';
import ProfileDetailTabs, { SLUGS } from './ProfileDetailTabs';

const ProfileDetail = (props) => {
    const {
        slug,
        profile,
    } = props;

    return (
        <div>
            <ProfileDetailHeader profile={profile} />
            <ProfileDetailTabs
                onRequestChange={() => {}}
                profile={profile}
                slug={slug}
            />
            <DetailContent />
        </div>
    );
};

ProfileDetail.propTypes = {
    directReports: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    onLoadMorePosts: PropTypes.func,
    peers: PropTypes.array,
    posts: PropTypes.array,
    teams: PropTypes.array,
};

ProfileDetail.defaultProps = {
    slug: SLUGS.KNOWLEDGE,
};

export default ProfileDetail;

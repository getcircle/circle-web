import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CreateCollectionForm from './CreateCollectionForm';
import DetailCollections from './DetailCollections';

const ProfileDetailCollections = ({ profile, ...other }) => {
    return (
        <div>
            <DetailCollections {...other} />
            <CreateCollectionForm
                ownerId={profile.id}
                ownerType={services.post.containers.CollectionV1.OwnerTypeV1.PROFILE}
            />
        </div>
    );
}

ProfileDetailCollections.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default ProfileDetailCollections;

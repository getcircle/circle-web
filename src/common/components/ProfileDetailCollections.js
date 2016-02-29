import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CreateCollectionForm from './CreateCollectionForm';
import DetailCollections from './DetailCollections';

const ProfileDetailCollections = ({ isAdmin, isLoggedInUser, profile, ...other }) => {
    const canEdit = isLoggedInUser;

    let form;
    if (profile && canEdit) {
        form = (
            <CreateCollectionForm
                ownerId={profile.id}
                ownerType={services.post.containers.CollectionV1.OwnerTypeV1.PROFILE}
            />
        );
    }
    return (
        <div>
            <DetailCollections
                canEdit={canEdit}
                {...other}
            />
            {form}
        </div>
    );
}

ProfileDetailCollections.propTypes = {
    isAdmin: PropTypes.bool,
    isLoggedInUser: PropTypes.bool,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default ProfileDetailCollections;

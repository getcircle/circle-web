import React, { PropTypes } from 'react';

import DetailListItemProfile from './DetailListItemProfile';
import Grid from './Grid';

const ProfilesGrid = ({ profiles }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                className="col-xs col-md-6"
                key={`detail-list-item-profile-${i}`}
                profile={p}
            />
        );
    });;
    return <Grid children={items} />;
};

ProfilesGrid.propTypes = {
    profiles: PropTypes.array.isRequired,
};

export default ProfilesGrid;

import React, { PropTypes } from 'react';

import DetailListItemProfile from './DetailListItemProfile';
import Grid from './Grid';

const ProfilesGrid = ({ MenuComponent, onMenuChoice, profiles }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                MenuComponent={MenuComponent}
                className="col-xs-6"
                key={`detail-list-item-profile-${i}`}
                onMenuChoice={onMenuChoice}
                profile={p}
            />
        );
    });;
    return <Grid children={items} />;
};

ProfilesGrid.propTypes = {
    MenuComponent: PropTypes.func,
    onMenuChoice: PropTypes.func,
    profiles: PropTypes.array.isRequired,
};

export default ProfilesGrid;

import React, { PropTypes } from 'react';

import DetailListItemProfile from './DetailListItemProfile';
import Grid from './Grid';

const ProfilesGrid = ({ MenuComponent, dispatch, profiles }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                MenuComponent={MenuComponent}
                className="col-xs-6"
                dispatch={dispatch}
                key={`detail-list-item-profile-${i}`}
                profile={p}
            />
        );
    });;
    return <Grid children={items} />;
};

ProfilesGrid.propTypes = {
    MenuComponent: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    profiles: PropTypes.array.isRequired,
};

export default ProfilesGrid;

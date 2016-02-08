import React, { PropTypes } from 'react';

import InfiniteGrid from './InfiniteGrid';
import DetailListItemProfile from './DetailListItemProfile';

const InfiniteProfilesGrid = ({ profiles, ...other }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                className="col-xs-12 col-md-6"
                key={`detail-list-item-profile-${i}`}
                profile={p}
            />
        );
    });
    return <InfiniteGrid children={items} elementHeight={75} {...other} />;
};

InfiniteProfilesGrid.propTypes = {
    onLoadMore: PropTypes.func,
    profiles: PropTypes.array.isRequired,
};

export default InfiniteProfilesGrid;

import React, { PropTypes } from 'react';

import InfiniteGrid from './InfiniteGrid';
import DetailListItemProfile from './DetailListItemProfile';

const InfiniteProfilesGrid = ({ MenuComponent, onMenuChoice, profiles, ...other }) => {
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
    });
    return <InfiniteGrid children={items} {...other} />;
};

InfiniteProfilesGrid.propTypes = {
    MenuComponent: PropTypes.func,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onMenuChoice: PropTypes.func,
    profiles: PropTypes.array.isRequired,
};

export default InfiniteProfilesGrid;

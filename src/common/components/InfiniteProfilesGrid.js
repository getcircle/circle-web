import React, { PropTypes } from 'react';

import InfiniteGrid from './InfiniteGrid';
import DetailListItemProfile from './DetailListItemProfile';

const InfiniteProfilesGrid = ({ dispatch, profiles, ...other }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                className="col-xs-6"
                dispatch={dispatch}
                key={`detail-list-item-profile-${i}`}
                profile={p}
            />
        );
    });
    return <InfiniteGrid children={items} elementHeight={75} {...other} />;
};

InfiniteProfilesGrid.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    profiles: PropTypes.array.isRequired,
};

export default InfiniteProfilesGrid;

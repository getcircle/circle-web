import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { List } from 'material-ui';

import DetailListItemProfile from './DetailListItemProfile';

const DetailListProfiles = ({ dispatch, profiles }) => {
    const items = profiles.map((p, i) => {
        return (
            <DetailListItemProfile
                dispatch={dispatch}
                key={`detail-list-item-profile-${i}`}
                profile={p}
            />
        );
    });
    return <List children={items} />;
};
DetailListProfiles.propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.arrayOf(
        PropTypes.instanceOf(services.profile.containers.ProfileV1)
    ),
};

export default DetailListProfiles;

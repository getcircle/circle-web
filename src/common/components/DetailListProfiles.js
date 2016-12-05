import React from 'react';

import { List } from 'material-ui';

import DetailListItemProfile from './DetailListItemProfile';

const DetailListProfiles = ({ profiles }) => {
    const items = profiles.map((p, i) => <DetailListItemProfile key={`detail-list-item-profile-${i}`} profile={p} />);
    return <List children={items} />;
};

export default DetailListProfiles;

import React from 'react';

import { List } from 'material-ui';

import DetailListItemTeamMinimal from './DetailListItemTeamMinimal';

const DetailListTeamsMinimal = ({ teams }) => {
    const items = teams.map((t, i) => <DetailListItemTeamMinimal key={`detail-list-item-team-${i}`} team={t} />);
    return <List children={items} />;
};

export default DetailListTeamsMinimal;

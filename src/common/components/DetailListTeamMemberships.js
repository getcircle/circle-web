import React, { PropTypes } from 'react';

import { List } from 'material-ui';

import DetailListItemTeamMembership from './DetailListItemTeamMembership';

const DetailListTeamMemberships = ({ members }) => {
    const items = members.map((m, i) => <DetailListItemTeamMembership key={`detail-list-item-team-${i}`} member={m} />);
    return <List children={items} />;
};

DetailListTeamMemberships.propTypes = {
    members: PropTypes.array.isRequired,
};

export default DetailListTeamMemberships;

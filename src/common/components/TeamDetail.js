import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailContent from './DetailContent';
import TeamDetailAbout from './TeamDetailAbout';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailPeople from './TeamDetailPeople';
import TeamDetailTabs, { SLUGS } from './TeamDetailTabs';

const TeamDetail = ({
    coordinators,
    slug,
    team,
}) => {
    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = <TeamDetailAbout coordinators={coordinators} team={team} />;
    case SLUGS.PEOPLE:
        content = <TeamDetailPeople coordinators={coordinators} />;
    }
    return (
        <div>
            <TeamDetailHeader coordinators={coordinators} team={team} />
            <TeamDetailTabs slug={slug} />
            <DetailContent>
                {content}
            </DetailContent>
        </div>
    );
};

TeamDetail.propTypes = {
    coordinators: PropTypes.array,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
};
TeamDetail.defaultProps = {
    slug: SLUGS.PEOPLE,
};

export default TeamDetail;

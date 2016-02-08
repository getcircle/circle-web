import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailContent from './DetailContent';
import TeamDetailAbout from './TeamDetailAbout';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailPeople from './TeamDetailPeople';
import TeamDetailTabs, { SLUGS } from './TeamDetailTabs';

const TeamDetail = (props) => {
    const {
        coordinators,
        members,
        membersLoading,
        onLoadMoreMembers,
        slug,
        team,
    } = props;

    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = <TeamDetailAbout coordinators={coordinators} team={team} />;
        break;
    case SLUGS.PEOPLE:
        content = (
            <TeamDetailPeople
                coordinators={coordinators}
                members={members}
                membersLoading={membersLoading}
                onLoadMoreMembers={onLoadMoreMembers}
            />
        );
        break;
    }
    return (
        <div>
            <TeamDetailHeader coordinators={coordinators} team={team} />
            <TeamDetailTabs slug={slug} team={team} />
            <DetailContent>
                {content}
            </DetailContent>
        </div>
    );
};

TeamDetail.propTypes = {
    coordinators: PropTypes.array,
    members: PropTypes.array,
    membersLoading: PropTypes.bool,
    onLoadMoreMembers: PropTypes.func,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
};

TeamDetail.defaultProps = {
    slug: SLUGS.PEOPLE,
};

export default TeamDetail;

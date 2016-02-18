import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { replaceTeamSlug } from '../utils/routes';

import DetailContent from './DetailContent';
import TeamDetailAbout from './TeamDetailAbout';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailPeople from './TeamDetailPeople';
import TeamDetailTabs, { SLUGS } from './TeamDetailTabs';

const TeamDetail = (props) => {
    const {
        coordinators,
        dispatch,
        members,
        membersLoading,
        onLoadMoreMembers,
        slug,
        team,
    } = props;

    let content;
    switch (slug) {
    case SLUGS.ABOUT:
        content = (
            <TeamDetailAbout
                coordinators={coordinators}
                dispatch={dispatch}
                team={team}
            />
        );
        break;
    case SLUGS.PEOPLE:
        content = (
            <TeamDetailPeople
                coordinators={coordinators}
                dispatch={dispatch}
                members={members}
                membersLoading={membersLoading}
                onLoadMoreMembers={onLoadMoreMembers}
                team={team}
            />
        );
        break;
    }
    return (
        <div>
            <TeamDetailHeader coordinators={coordinators} team={team} />
            <TeamDetailTabs
                onRequestChange={replaceTeamSlug}
                slug={slug}
                team={team}
            />
            <DetailContent>
                {content}
            </DetailContent>
        </div>
    );
};

TeamDetail.propTypes = {
    coordinators: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
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

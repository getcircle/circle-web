import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { replaceTeamSlug } from '../utils/routes';

import DetailContent from './DetailContent';
import TeamDetailAbout from './TeamDetailAbout';
import TeamDetailCollections from './TeamDetailCollections';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailPeople from './TeamDetailPeople';
import TeamDetailTabs, { SLUGS } from './TeamDetailTabs';

const TeamDetail = (props) => {
    const {
        collections,
        collectionsCount,
        collectionsLoaded,
        collectionsLoading,
        coordinators,
        currentUserMember,
        defaultCollection,
        defaultCollectionLoaded,
        dispatch,
        hasMoreCollections,
        hasMoreMembers,
        members,
        membersCount,
        membersLoading,
        onLoadMoreMembers,
        onLoadMoreCollections,
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
                hasMoreMembers={hasMoreMembers}
                members={members}
                membersCount={membersCount}
                membersLoading={membersLoading}
                onLoadMoreMembers={onLoadMoreMembers}
                team={team}
            />
        );
        break;
    case SLUGS.COLLECTIONS:
        content = (
            <TeamDetailCollections
                collections={collections}
                collectionsCount={collectionsCount}
                defaultCollection={defaultCollection}
                defaultCollectionLoaded={defaultCollectionLoaded}
                hasMore={!!hasMoreCollections}
                loaded={collectionsLoaded}
                loading={collectionsLoading}
                onLoadMore={onLoadMoreCollections}
                team={team}
            />
        );
        break;
    }
    return (
        <div>
            <TeamDetailHeader
                coordinators={coordinators}
                currentUserMember={currentUserMember}
                team={team}
            />
            <TeamDetailTabs
                collectionsCount={collectionsCount}
                membersCount={membersCount}
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
    collections: PropTypes.array,
    collectionsCount: PropTypes.number,
    collectionsLoaded: PropTypes.bool,
    collectionsLoading: PropTypes.bool,
    coordinators: PropTypes.array,
    currentUserMember: PropTypes.instanceOf(services.team.containers.TeamMemberV1),
    defaultCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    defaultCollectionLoaded: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    hasMoreCollections: PropTypes.bool,
    hasMoreMembers: PropTypes.bool,
    members: PropTypes.array,
    membersCount: PropTypes.number,
    membersLoading: PropTypes.bool,
    onLoadMoreCollections: PropTypes.func,
    onLoadMoreMembers: PropTypes.func,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
};

TeamDetail.defaultProps = {
    slug: SLUGS.COLLECTIONS,
};

export default TeamDetail;

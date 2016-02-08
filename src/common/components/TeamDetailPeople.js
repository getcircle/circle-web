import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import DetailSection from './DetailSectionV2';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';
import ProfilesGrid from './ProfilesGrid';

const TeamDetailPeople = ({ coordinators, members, membersLoading, onLoadMoreMembers }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let coordinatorsSection;
    if (coordinators && coordinators.length) {
        const coordinatorProfiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection title={t('Coordinators')}>
                <ProfilesGrid profiles={coordinatorProfiles} />
            </DetailSection>
        );
    }

    let membersSection;
    if (members && members.length) {
        const memberProfiles = members.map(m => m.profile);
        membersSection = (
            <DetailSection title={t('Members')}>
                <InfiniteProfilesGrid
                    loading={membersLoading}
                    onLoadMore={onLoadMoreMembers}
                    profiles={memberProfiles}
                />
            </DetailSection>
        );
    }

    return (
        <div>
            <section>
                <h1 style={theme.h1}>{t('People')}</h1>
            </section>
            {coordinatorsSection}
            {membersSection}
        </div>
    );
};

TeamDetailPeople.propTypes = {
    coordinators: PropTypes.array,
    members: PropTypes.array,
    membersLoading: PropTypes.bool,
    onLoadMoreMembers: PropTypes.func,
};

TeamDetailPeople.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailPeople;

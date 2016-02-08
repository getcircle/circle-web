import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { FADE } from '../constants/animations';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailSection from './DetailSectionV2';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';
import ProfilesGrid from './ProfilesGrid';

const TeamDetailPeople = (props, { device, muiTheme }) => {
    const { coordinators, members, membersLoading, onLoadMoreMembers } = props;
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
    if (device.mounted && members && members.length) {
        const memberProfiles = members.map(m => m.profile);
        membersSection = (
            <DetailSection key="members-section" title={t('Members')}>
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
            <ReactCSSTransitionGroup
                transitionAppear={true}
                transitionName={FADE}
            >
                {membersSection}
            </ReactCSSTransitionGroup>
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
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailPeople;

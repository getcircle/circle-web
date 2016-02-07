import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import DetailSection from './DetailSectionV2';
import ProfilesGrid from './ProfilesGrid';

const TeamDetailPeople = ({ coordinators }, { muiTheme }) => {
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

    return (
        <div>
            <section>
                <h1 style={theme.h1}>{t('People')}</h1>
            </section>
            {coordinatorsSection}
        </div>
    );
};

TeamDetailPeople.propTypes = {
    coordinators: PropTypes.array.isRequired,
};

TeamDetailPeople.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailPeople;

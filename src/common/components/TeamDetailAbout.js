import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import DetailListProfiles from './DetailListProfiles';
import DetailSection from './DetailSectionV2';

const TeamDetailAbout = ({ coordinators, team }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let coordinatorsSection;
    if (coordinators) {
        const profiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection dividerStyle={{marginBottom: 0}} title={t('Coordinators')}>
                <DetailListProfiles profiles={profiles} />
            </DetailSection>
        );
    }

    return (
        <div>
            <section>
                <h1 style={theme.h1}>{t('About')}</h1>
            </section>
            <DetailSection title={t('Description')}>
                <div>
                    <p style={theme.primaryText}>{team.description.value}</p>
                </div>
            </DetailSection>
            {coordinatorsSection}
        </div>
    );
};

TeamDetailAbout.propTypes = {
    coordinators: PropTypes.array,
    team: PropTypes.shape({
        description: PropTypes.shape({
            value: PropTypes.string.isRequired,
        }),
    }),
};
TeamDetailAbout.contextTypes = {
    muiTheme: PropTypes.object,
};

export default TeamDetailAbout;

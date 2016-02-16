import React, { PropTypes } from 'react';

import { showTeamEditModal } from '../actions/teams';
import t from '../utils/gettext';

import DetailListProfiles from './DetailListProfiles';
import DetailSection from './DetailSectionV2';
import EditIcon from './EditIcon';

const TeamDetailAbout = ({ coordinators, dispatch, team }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    const styles = {
        edit: {
            cursor: 'pointer',
            marginBottom: 2,
            verticalAlign: 'middle',
        },
        mainSection: {
            width: '70%',
        },
    };

    let coordinatorsSection;
    if (coordinators) {
        const profiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection
                dividerStyle={{marginBottom: 0}}
                style={styles.mainSection}
                title={t('Coordinators')}
            >
                <DetailListProfiles profiles={profiles} />
            </DetailSection>
        );
    }

    let editIcon;
    if (team.permissions && team.permissions.can_edit) {
        const onEdit = () => dispatch(showTeamEditModal());
        editIcon = (
            <EditIcon
                onTouchTap={onEdit}
                stroke={muiTheme.luno.tintColor}
                style={styles.edit}
            />
        );
    }

    let descriptionSection;
    if (team.description && team.description.value) {
        descriptionSection = (
            <DetailSection style={styles.mainSection} title={t('Description')}>
                <div>
                    <p style={theme.primaryText}>{team.description.value}</p>
                </div>
            </DetailSection>
        );
    }

    return (
        <div>
            <section>
                <h1 style={theme.h1}>{t('About')} {editIcon}</h1>
            </section>
            {descriptionSection}
            {coordinatorsSection}
        </div>
    );
};

TeamDetailAbout.propTypes = {
    coordinators: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
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

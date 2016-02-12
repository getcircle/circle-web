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
        }
    };

    let coordinatorsSection;
    if (coordinators) {
        const profiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection dividerStyle={{marginBottom: 0}} title={t('Coordinators')}>
                <DetailListProfiles profiles={profiles} />
            </DetailSection>
        );
    }

    let editIcon;
    console.log(team);
    if (team.permissions && team.permissions.can_edit) {
        const onEdit = () => dispatch(showTeamEditModal());
        editIcon = (
            <EditIcon
                onClick={onEdit}
                stroke={muiTheme.luno.tintColor}
                style={styles.edit}
            />
        );
    }

    return (
        <div>
            <section>
                <h1 style={theme.h1}>{t('About')} {editIcon}</h1>
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

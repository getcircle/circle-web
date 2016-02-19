import React, { PropTypes } from 'react';

import { IconButton } from 'material-ui';

import t from '../../utils/gettext';

import DetailListProfiles from '../DetailListProfiles';
import DetailSection from '../DetailSectionV2';
import EditIcon from '../EditIcon';
import TeamEditForm from '../TeamEditForm';

import { buildShowTeamEditModal } from './helpers';
import ContactMethods from './ContactMethods';
import Description from './Description';

const TeamDetailAbout = ({ coordinators, dispatch, team }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
    const styles = {
        edit: {
            cursor: 'pointer',
            marginBottom: 2,
            verticalAlign: 'middle',
        },
        section: {
            padding: 0,
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
        editIcon = (
            <IconButton onTouchTap={buildShowTeamEditModal(dispatch)}>
                <EditIcon stroke={muiTheme.luno.tintColor} />
            </IconButton>
        );
    }

    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('About')}</h1>
                {editIcon}
            </section>
            <section className="row">
                <section className="col-xs-8" style={styles.section}>
                    <Description
                        dispatch={dispatch}
                        team={team}
                        theme={theme}
                    />
                    {coordinatorsSection}
                </section>
                <section className="col-xs-offset-1 col-xs-3" style={styles.section}>
                    <ContactMethods
                        dispatch={dispatch}
                        team={team}
                    />
                </section>
            </section>
            <TeamEditForm team={team} />
        </div>
    );
};

TeamDetailAbout.propTypes = {
    coordinators: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    team: PropTypes.shape({
        description: PropTypes.shape({
            value: PropTypes.string,
        }),
    }),
};
TeamDetailAbout.contextTypes = {
    muiTheme: PropTypes.object,
};

export default TeamDetailAbout;

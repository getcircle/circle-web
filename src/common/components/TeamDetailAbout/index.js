import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { deleteTeam, hideConfirmDeleteModal } from '../../actions/teams';
import t from '../../utils/gettext';

import DeleteTeamConfirmation from '../DeleteTeamConfirmation';
import DetailListProfiles from '../DetailListProfiles';
import DetailSection from '../DetailSectionV2';
import TeamEditForm from '../TeamEditForm';

import ContactMethods from './ContactMethods';
import Description from './Description';
import Menu from './Menu';

const TeamDetailAbout = (props, { store: { dispatch }, muiTheme }) => {
    const {
        collectionsCount,
        coordinators,
        membersCount,
        pendingTeamToDelete,
        team,
    } = props;
    const theme = muiTheme.luno.detail;
    const styles = {
        edit: {
            cursor: 'pointer',
            marginBottom: 2,
            verticalAlign: 'middle',
        },
    };

    function handleDeleteRequestClose() {
        dispatch(hideConfirmDeleteModal());
    }

    function handleDelete() {
        dispatch(hideConfirmDeleteModal());
        // TODO: Enable once action is available
        // dispatch(deleteTeam(pendingTeamToDelete));
        browserHistory.goBack();
    }

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

    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('About')}</h1>
                <Menu team={team} />
            </section>
            <section className="row">
                <section className="col-xs-8" style={theme.section}>
                    <Description
                        dispatch={dispatch}
                        team={team}
                        theme={theme}
                    />
                    {coordinatorsSection}
                </section>
                <section className="col-xs-4" style={theme.secondarySection}>
                    <ContactMethods
                        dispatch={dispatch}
                        team={team}
                    />
                </section>
            </section>
            <TeamEditForm team={team} />
            <DeleteTeamConfirmation
                collectionsCount={collectionsCount}
                coordinatorsCount={coordinators.length}
                membersCount={membersCount}
                onRequestClose={handleDeleteRequestClose}
                onSave={handleDelete}
                open={!!pendingTeamToDelete}
                team={team}
            />
        </div>
    );
};

TeamDetailAbout.propTypes = {
    collectionsCount: PropTypes.number,
    coordinators: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    membersCount: PropTypes.number,
    pendingTeamToDelete: PropTypes.instanceOf(services.team.containers.TeamV1),
    team: PropTypes.shape({
        description: PropTypes.shape({
            value: PropTypes.string,
        }),
    }),
};
TeamDetailAbout.contextTypes = {
    muiTheme: PropTypes.object,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

export default TeamDetailAbout;

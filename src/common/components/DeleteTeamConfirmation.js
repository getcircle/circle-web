import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import DestructiveDialog from './DestructiveDialog';

function buildOtherWarning(name, collections, members) {
    let warning = '';
    if (collections && collections > 0) {
        warning = t(`the ${ collections } Collections will also be deleted`);
    }
    if (members && members > 0) {
        if (warning.length > 0) {
            warning = warning + t(', and ');
        }
        warning = warning + t(`the ${ members } members will be removed from this team`);
    }

    if (warning) {
        warning = `If you delete ${ name }, ` + warning;

        return (
            <div>
                <p>{warning}</p>
                <br />
            </div>
        )
    } else {
        return null;
    }
}

const DeleteTeamConfirmation = (props) => {
    const {
        coordinatorsCount,
        collectionsCount,
        membersCount,
        team,
        ...other
    } = props;

    const styles = {
        container: {
            padding: 30,
            fontSize: '1.4rem',
            lineHeight: '1.7rem',
        },
    };

    let dialog;
    if (team) {
        let coordinatorWarning;
        if (coordinatorsCount && coordinatorsCount > 1) {
            coordinatorWarning = t(`The other ${ team.name } Coordinators will be notified.`);
        } else {
            coordinatorWarning = null;
        }
        const otherWarning = buildOtherWarning(team.name, collectionsCount, membersCount);
        dialog = (
            <DestructiveDialog
                title={t('Delete Team')}
                {...other}
            >
                <div style={styles.container}>
                    <p>{t('Deleting a Team is final and cannot be undone.')} {coordinatorWarning}</p>
                    <br />
                    {otherWarning}
                    <p>{t(`Are you sure you want to delete ${ team.name }?`)}</p>
                </div>
            </DestructiveDialog>
        );
    }
    return (
        <div>
            {dialog}
        </div>
    );
};

DeleteTeamConfirmation.propTypes = {
    collectionsCount: PropTypes.number,
    coordinatorsCount: PropTypes.number,
    membersCount: PropTypes.number,
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};


export default DeleteTeamConfirmation;

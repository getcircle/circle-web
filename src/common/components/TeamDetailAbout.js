import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { IconButton } from 'material-ui';

import Colors from '../styles/Colors';
import { showTeamEditModal } from '../actions/teams';
import t from '../utils/gettext';
import { mailto } from '../utils/contact';

import DetailListProfiles from './DetailListProfiles';
import DetailSection from './DetailSectionV2';
import EditIcon from './EditIcon';
import TeamEditForm from '../components/TeamEditForm';

const ContactMethod = ({ method }, { muiTheme }) => {
    const styles = {
        container: {
            paddingBottom: 10,
        },
        label: {
            color: Colors.lightBlack,
            fontSize: '1.3rem',
        },
        value: {
            fontWeight: muiTheme.luno.fontWeights.bold,
            fontSize: '1.3rem',
            textAlign: 'right',
        },
        slack: {
            color: Colors.mediumBlack,
        },
        email: {
            color: muiTheme.luno.tintColor,
            textDecoration: 'none',
        },
    };

    let label;
    let value;
    if (method.type) {
        label = t('Slack:');
        value = <span className="col-xs" style={{...styles.value, ...styles.slack}}>{method.value}</span>;
    } else {
        label = t('Email:');
        value = (
            <a
                className="col-xs"
                href={mailto(method.value)}
                style={{...styles.value, ...styles.email}}
                target="_blank"
            >
                {method.value}
            </a>
        );
    }

    return (
        <li className="row between-xs" style={styles.container}>
            <span className="col-xs" style={styles.label}>{label}</span>
            {value}
        </li>
    );
}

ContactMethod.propTypes = {
    method: PropTypes.instanceOf(services.team.containers.ContactMethodV1),
};

ContactMethod.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const ContactMethodsSection = ({ contactMethods, ...other }) => {
    return (
        <DetailSection title={t('Contact')} {...other}>
            <ul>
                {contactMethods.map((method, index) => <ContactMethod key={`contact-method-${index}`} method={method} />)}
            </ul>
        </DetailSection>
    )
};

ContactMethodsSection.propTypes = {
    contactMethods: PropTypes.array.isRequired,
};

const TeamDetailAbout = ({ coordinators, dispatch, team }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    const styles = {
        edit: {
            cursor: 'pointer',
            marginBottom: 2,
            verticalAlign: 'middle',
        },
    };

    let coordinatorsSection;
    if (coordinators) {
        const profiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection
                className="col-xs-8"
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
            <IconButton onTouchTap={onEdit}>
                <EditIcon stroke={muiTheme.luno.tintColor} />
            </IconButton>
        );
    }

    let descriptionSection;
    if (team.description && team.description.value) {
        descriptionSection = (
            <DetailSection className="col-xs-8" title={t('Description')}>
                <div>
                    <p style={theme.primaryText}>{team.description.value}</p>
                </div>
            </DetailSection>
        );
    }

    let contactSection;
    if (team.contact_methods) {
        contactSection = (
            <ContactMethodsSection
                className="col-xs-offset-1 col-xs-3"
                contactMethods={team.contact_methods}
            />
        );
    }

    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('About')}</h1>
                {editIcon}
            </section>
            <section className="row">
                {descriptionSection}
                {contactSection}
            </section>
            {coordinatorsSection}
            <TeamEditForm team={team} />
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

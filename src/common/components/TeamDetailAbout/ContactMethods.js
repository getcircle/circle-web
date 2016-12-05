import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import { mailto } from '../../utils/contact';
import Colors from '../../styles/Colors';

import DetailSection from '../DetailSectionV2';

import { buildShowTeamEditModal } from './helpers';

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

const ContactMethods = ({ dispatch, team, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let value;
    if (team.contact_methods.length) {
        value = (
            <ul>
                {team.contact_methods.map((method, index) => <ContactMethod key={`contact-method-${index}`} method={method} />)}
            </ul>
        );
    } else if (team.permissions && team.permissions.can_edit) {
        value = <a onTouchTap={buildShowTeamEditModal(dispatch)} style={{...theme.primaryText, ...theme.link}}>{t('Add info')}</a>;
    } else {
        value = <p style={theme.primaryText}>{t('No info')}</p>;
    }

    return (
        <DetailSection title={t('Contact')} {...other}>
            {value}
        </DetailSection>
    )
};

ContactMethods.propTypes = {
    dispatch: PropTypes.func.isRequired,
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
};
ContactMethods.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ContactMethods;

import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Colors from '../../styles/Colors';
import { mailto } from '../../utils/contact';
import t from '../../utils/gettext';

import DetailSection from '../DetailSectionV2';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

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
    switch(method.contact_method_type) {
    case ContactMethodTypeV1.SLACK:
        label = t('Slack:');
        value = <span className="col-xs" style={{...styles.value, ...styles.slack}}>{method.value}</span>;
        break;
    case ContactMethodTypeV1.EMAIL:
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
        break;
    case null:
    case ContactMethodTypeV1.CELL_PHONE:
        label = t('Cell Phone:');
        value = <span className="col-xs" style={{...styles.value, ...styles.slack}}>{method.value}</span>;
        break;
    }

    if (label && value) {
        return (
            <li className="row between-xs" style={styles.container}>
                <span className="col-xs" style={styles.label}>{label}</span>
                {value}
            </li>
        );
    } else {
        return <span />;
    }
}

ContactMethod.propTypes = {
    method: PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
};

ContactMethod.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const ContactMethods = ({ dispatch, canEdit, profile }) => {
    let methods = [new services.profile.containers.ContactMethodV1({
        /*eslint-disable camelcase*/
        contact_method_type: ContactMethodTypeV1.EMAIL,
        /*eslint-enable camelcase*/
        value: profile.email,
    })];
    if (profile.contact_methods && profile.contact_methods.length) {
        methods = methods.concat(profile.contact_methods);
    }

    return (
        <DetailSection title={t('Contact')}>
            <ul>
                {methods.map((method, index) => <ContactMethod key={`contact-method-${index}`} method={method} />)}
            </ul>
        </DetailSection>
    );
};

ContactMethods.propTypes = {
    canEdit: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
};

ContactMethods.defaultProps = {
    canEdit: false,
};

export { ContactMethod };
export default ContactMethods;

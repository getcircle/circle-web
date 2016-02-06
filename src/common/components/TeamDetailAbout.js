import React, { PropTypes } from 'react';

import { Divider } from 'material-ui';

import t from '../utils/gettext';

import DetailListProfiles from './DetailListProfiles';

const DetailDivider = ({ style, ...other }) => {
    style = {
        marginTop: 5,
        marginBottom: 20,
        ...style,
    };
    return <Divider style={style} {...other} />;
};

const TeamDetailAbout = ({ coordinators, team }, { muiTheme }) => {
    const styles = {
        container: {
            paddingTop: 50,
        },
        section: {
            paddingTop: 35,
        },
    };

    const theme = muiTheme.luno.detail;

    let coordinatorsSection;
    if (coordinators) {
        const profiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <section style={styles.section}>
                <h2 style={theme.h2}>{t('Coordinators')}</h2>
                <DetailDivider style={{marginBottom: 0}}/>
                <DetailListProfiles profiles={profiles} />
            </section>
        );
    }

    return (
        <div style={styles.container}>
            <section>
                <h1 style={theme.h1}>{t('About')}</h1>
            </section>
            <section style={styles.section}>
                <h2 style={theme.h2}>{t('Description')}</h2>
                <DetailDivider />
                <div>
                    <p style={theme.primaryText}>{team.description.value}</p>
                </div>
            </section>
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

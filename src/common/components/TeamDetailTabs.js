import React, { PropTypes } from 'react';

import {
    Divider,
} from 'material-ui';

import t from '../utils/gettext';
import { replaceTeamSlug } from '../utils/routes';

import InternalPropTypes from './InternalPropTypes';

import Tab from './Tab';
import Tabs from './Tabs';

export const SLUGS = {
    ABOUT: t('about'),
    PEOPLE: t('people'),
};

const TeamDetailTabs = ({ team, slug }, { history }) => {
    const styles = {
        root: {
            padding: '0 100px 0 100px',
            marginBottom: 0,
        },
        tabs: {
            width: 200,
        },
    };

    function handleRequestChange(e, slug) {
        replaceTeamSlug(history, team, slug);
    }

    return (
        <div>
            <section className="wrap" style={styles.root}>
                <div>
                    <Tabs
                        onRequestChange={handleRequestChange}
                        style={styles.tabs}
                        value={slug}
                    >
                        <Tab label={t('People')} value={SLUGS.PEOPLE} />
                        <Tab label={t('About')} value={SLUGS.ABOUT} />
                    </Tabs>
                </div>
            </section>
            <Divider />
        </div>
    );
};

TeamDetailTabs.propTypes = {
    slug: PropTypes.oneOf(Object.values(SLUGS)),
    team: InternalPropTypes.TeamV1,
};

TeamDetailTabs.contextTypes = {
    history: InternalPropTypes.history.isRequired,
};

export default TeamDetailTabs;

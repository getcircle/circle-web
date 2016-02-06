import React, { PropTypes } from 'react';

import {
    Divider,
} from 'material-ui';

import t from '../utils/gettext';

import Tab from './Tab';
import Tabs from './Tabs';

export const SLUGS = {
    ABOUT: t('about'),
};

const TeamDetailTabs = ({ slug }) => {
    const styles = {
        root: {
            padding: '0 100px 0 100px',
        },
        tabs: {
            width: 200,
        },
    };
    return (
        <div>
            <section style={styles.root}>
                <div>
                    <Tabs style={styles.tabs} value={slug}>
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
};

export default TeamDetailTabs;

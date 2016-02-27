import React, { PropTypes } from 'react';

import { updateTeamSlug } from '../actions/teams';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailTabs from './DetailTabs';
import Tab from './Tab';

export const SLUGS = {
    COLLECTIONS: t('collections'),
    ABOUT: t('about'),
    PEOPLE: t('people'),
};

const TeamDetailTabs = ({ onRequestChange, team, slug, ...other}, { store: { dispatch } }) => {
    function handleRequestChange(e, nextSlug) {
        dispatch(updateTeamSlug(team, slug, nextSlug));
        onRequestChange(team, nextSlug);
    }

    return (
        <DetailTabs
            onRequestChange={handleRequestChange}
            slug={slug}
            {...other}
        >
            <Tab label={t('Collections')} value={SLUGS.COLLECTIONS} />
            <Tab label={t('People')} value={SLUGS.PEOPLE} />
            <Tab label={t('About')} value={SLUGS.ABOUT} />
        </DetailTabs>
    );
};

TeamDetailTabs.propTypes = {
    onRequestChange: PropTypes.func.isRequired,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
    team: InternalPropTypes.TeamV1,
};

TeamDetailTabs.contextTypes = {
    store: PropTypes.object.isRequired,
};

export default TeamDetailTabs;

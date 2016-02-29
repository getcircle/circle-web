import React, { PropTypes } from 'react';

import { updateProfileSlug } from '../actions/profiles';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailTabs from './DetailTabs';
import Tab from './Tab';

export const SLUGS = {
    COLLECTIONS: t('collections'),
    KNOWLEDGE: t('knowledge'),
    ABOUT: t('about'),
};

const ProfileDetailTabs = ({ collectionsCount, onRequestChange, postsCount, profile, slug, ...other }, { store: { dispatch } }) => {
    function handleRequestChange(e, nextSlug) {
        dispatch(updateProfileSlug(profile, slug, nextSlug));
        onRequestChange(profile, nextSlug);
    }

    const collectionsCountString = collectionsCount ? ` (${collectionsCount})` : '';
    const postsCountString = postsCount ? ` (${postsCount})` : '';
    return (
        <DetailTabs
            onRequestChange={handleRequestChange}
            slug={slug}
            {...other}
        >
            <Tab label={t('Knowledge') + postsCountString} value={SLUGS.KNOWLEDGE} />
            <Tab label={t('Collections') + collectionsCountString} value={SLUGS.COLLECTIONS} />
            <Tab label={t('About')} value={SLUGS.ABOUT} />
        </DetailTabs>
    );
};

ProfileDetailTabs.propTypes = {
    collectionsCount: PropTypes.number,
    onRequestChange: PropTypes.func.isRequired,
    postsCount: PropTypes.number,
    profile: InternalPropTypes.ProfileV1,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
};

ProfileDetailTabs.contextTypes = {
    store: PropTypes.object.isRequired,
};

export default ProfileDetailTabs;

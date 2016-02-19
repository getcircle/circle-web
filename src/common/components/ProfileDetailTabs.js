import React, { PropTypes } from 'react';

import { updateProfileSlug } from '../actions/profiles';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailTabs from './DetailTabs';
import Tab from './Tab';

export const SLUGS = {
    KNOWLEDGE: t('knowledge'),
    ABOUT: t('about'),
};

const ProfileDetailTabs = ({ onRequestChange, profile, slug, ...other }, { store: { dispatch } }) => {
    function handleRequestChange(e, nextSlug) {
        dispatch(updateProfileSlug(profile, slug, nextSlug));
        onRequestChange(profile, nextSlug);
    }

    return (
        <DetailTabs
            onRequestChange={handleRequestChange}
            slug={slug}
            {...other}
        >
            <Tab label={t('Knowledge')} value={SLUGS.KNOWLEDGE} />
            <Tab label={t('About')} value={SLUGS.ABOUT} />
        </DetailTabs>
    );
};

ProfileDetailTabs.propTypes = {
    onRequestChange: PropTypes.func.isRequired,
    profile: InternalPropTypes.ProfileV1,
    slug: PropTypes.oneOf(Object.values(SLUGS)),
};

ProfileDetailTabs.contextTypes = {
    store: PropTypes.object.isRequired,
};

export default ProfileDetailTabs;

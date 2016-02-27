import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CollectionIcon from './CollectionIcon';
import DetailSection from './DetailSectionV2';
import DetailTitle from './DetailTitle';

const ProfileDetailCollections = (props, { muiTheme }) => {
    return (
        <div>
            <DetailTitle
                IconComponent={CollectionIcon}
                title={t('Collections')}
            />
            <DetailSection
                dividerStyle={muiTheme.luno.collections.divider}
                style={{paddingTop: 0}}
            >
            </DetailSection>
        </div>
    );
};

ProfileDetailCollections.propTypes = {
};

ProfileDetailCollections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ProfileDetailCollections;

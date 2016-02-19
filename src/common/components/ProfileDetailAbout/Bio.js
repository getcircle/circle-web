import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import DetailSection from '../DetailSectionV2';

export const Bio = ({ profile, ...other}, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let value;
    if (profile.bio) {
        value = <p style={theme.primaryText}>{profile.bio}</p>;
    } else {
        value = <p style={theme.primaryText}>{t('No info')}</p>;
    }

    return (
        <DetailSection title={t('Bio')} {...other}>
            <div>
                {value}
            </div>
        </DetailSection>
    );
};

Bio.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
};

Bio.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Bio;

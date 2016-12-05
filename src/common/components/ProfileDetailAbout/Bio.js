import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';
import DetailSection from '../DetailSectionV2';

import { buildShowModal } from './helpers';

export const Bio = ({ dispatch, canEdit, profile, ...other}, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let value;
    if (profile.bio) {
        value = <p style={theme.primaryText}>{profile.bio}</p>;
    } else if (canEdit) {
        value = <a onTouchTap={buildShowModal(dispatch)} style={{...theme.primaryText, ...theme.link}}>{t('Add bio')}</a>;
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
    canEdit: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
};

Bio.defaultProps = {
    canEdit: false,
};

Bio.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Bio;

import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import DetailSection from '../DetailSectionV2';

import { buildShowTeamEditModal } from './helpers';

const Description = ({ dispatch, team, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;

    let value;
    if (team.description && team.description.value) {
        value = <p style={theme.primaryText}>{team.description.value}</p>;
    } else if (team.permissions && team.permissions.can_edit) {
        value = <a onTouchTap={buildShowTeamEditModal(dispatch)} style={{...theme.primaryText, ...theme.link}}>{t('Add description')}</a>;
    } else {
        value = <p style={theme.primaryText}>{t('No info')}</p>;
    }

    return (
        <DetailSection title={t('Description')} {...other}>
            <div>
                {value}
            </div>
        </DetailSection>
    );
};

Description.propTypes = {
    dispatch: PropTypes.func.isRequired,
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
};

Description.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Description;

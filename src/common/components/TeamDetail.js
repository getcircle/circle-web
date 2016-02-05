import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import TeamDetailHeader from './TeamDetailHeader';

const TeamDetail = ({coordinators, team}) => {
    return (
        <div>
            <TeamDetailHeader coordinators={coordinators} team={team} />
        </div>
    );
};

TeamDetail.propTypes = {
    coordinators: PropTypes.array,
    team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
}

export default TeamDetail;

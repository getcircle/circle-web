import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CreateCollectionForm from './CreateCollectionForm';
import DetailCollections from './DetailCollections';

const TeamDetailCollections = ({ team, ...other }) => {
    return (
        <div>
            <DetailCollections {...other} />
            <CreateCollectionForm
                ownerId={team.id}
                ownerType={services.post.containers.CollectionV1.OwnerTypeV1.TEAM}
            />
        </div>
    );
};

TeamDetailCollections.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};

export default TeamDetailCollections;

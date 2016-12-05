import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CreateCollectionForm from './CreateCollectionForm';
import DetailCollections from './DetailCollections';

const { TEAM } = services.post.containers.CollectionV1.OwnerTypeV1;

const TeamDetailCollections = ({ team, ...other }) => {
    const canEdit = team && team.permissions && team.permissions.can_edit;
    let form;
    if (team && canEdit) {
        form = (
            <CreateCollectionForm
                ownerId={team.id}
                ownerType={TEAM}
            />
        );
    }
    return (
        <div>
            <DetailCollections
                canEdit={canEdit}
                ownerId={team.id}
                ownerType={TEAM}
                {...other}
            />
            {form}
        </div>
    );
};

TeamDetailCollections.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};

export default TeamDetailCollections;

import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { Link } from 'react-router';

import { getProfilePath } from '../utils/routes';
import t from '../utils/gettext';

import DetailHeader from './DetailHeader';
import GroupIcon from './GroupIcon';

function getCoordinatorNames(coordinators, style) {
    return coordinators.map((c, i) => {
        return (
            <Link
                className="team-detail-header-coordinator"
                key={`coordinator-${i}`}
                style={style}
                to={getProfilePath(c.profile)}
            >
                {c.profile.full_name}
            </Link>
        )
    });
}

function getCoordinatorDetails(coordinators, muiTheme) {
    if (!coordinators) {
        return <span />;
    }

    const style = {
        fontWeight: muiTheme.luno.fontWeights.black,
    };

    const main = <span>{t('Coordinated by ')}</span>;
    const fullNames = getCoordinatorNames(coordinators, style);

    let byLine;
    if (coordinators.length === 1) {
        byLine = <span>{fullNames[0]}</span>;
    } else if (coordinators.length === 2) {
        byLine = <span>{fullNames[0]}{' & '}{fullNames[1]}</span>;
    } else {
        const commaSeparatedItems = fullNames.slice(0, fullNames.length - 2).map((n, i) => <span key={`comma-delimited-${i}`}>{n}{", "}</span>);
        const andSeparatedItems = fullNames.slice(fullNames.length - 2);
        byLine = <span>{commaSeparatedItems}{andSeparatedItems[0]}{" & "}{andSeparatedItems[1]}</span>;
    }
    return <span>{main}{byLine}</span>;
}

const TeamDetailHeader = ({team, coordinators}, {muiTheme}) => {
    const coordinatorDetails = getCoordinatorDetails(coordinators, muiTheme);
    return (
        <DetailHeader
            Icon={GroupIcon}
            primaryText={team.name}
            secondaryText={coordinatorDetails}
        />
    );
};

TeamDetailHeader.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};
TeamDetailHeader.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailHeader;

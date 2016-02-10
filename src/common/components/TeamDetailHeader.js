import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { FADE } from '../constants/animations';
import t from '../utils/gettext';

import DetailHeader from './DetailHeader';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';

function getCoordinatorNames(coordinators) {
    return coordinators.map((c, i) => <b key={`coordinator-${i}`}>{c.profile.full_name}</b>);
}

function getCoordinatorDetails(coordinators) {
    if (!coordinators) {
        return <span />;
    }

    const main = <span>{t('Coordinated by ')}</span>;
    let byLine;
    if (coordinators.length === 1) {
        byLine = <span><b>{coordinators[0].profile.full_name}</b></span>;
    } else if (coordinators.length === 2) {
        const fullNames = getCoordinatorNames(coordinators);
        byLine = <span>{fullNames[0]}{' & '}{fullNames[1]}</span>;
    } else {
        const fullNames = getCoordinatorNames(coordinators);
        const commaSeparatedItems = fullNames.slice(0, fullNames.length - 2).map((n, i) => <span key={`comma-delimited-${i}`}>{n}{", "}</span>);
        const andSeparatedItems = fullNames.slice(fullNames.length - 2);
        byLine = <span>{commaSeparatedItems}{andSeparatedItems[0]}{" & "}{andSeparatedItems[1]}</span>;
    }
    return <span>{main}{byLine}</span>;
}

const Icon = ({muiTheme}) => {
    return (
        <IconContainer
            IconClass={GroupIcon}
            iconStyle={{...muiTheme.luno.header.icon}}
            stroke={muiTheme.luno.header.icon.color}
            strokeWidth={muiTheme.luno.header.icon.strokeWidth}
            style={muiTheme.luno.header.iconContainer}
        />
    );
};

const Details = ({coordinators, muiTheme, onEdit, team}) => {
    const styles = {
        container: {
            paddingTop: 20,
        },
    };
    const coordinatorDetails = getCoordinatorDetails(coordinators);
    return (
        <section style={styles.container}>
            <div className="row center-xs start-md">
                <span style={muiTheme.luno.header.primaryText}>{team.name}</span>
            </div>
            <div className="row center-xs start-md">
                <ReactCSSTransitionGroup
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeave={false}
                    transitionName={FADE}
                >
                    <span key="team-coordinators" style={muiTheme.luno.header.secondaryText}>{coordinatorDetails}</span>
                </ReactCSSTransitionGroup>
            </div>
            <a onTouchTap={onEdit}>{t('Edit')}</a>
        </section>
    );
};

const TeamDetailHeader = ({team, coordinators, onEdit}, {dispatch, muiTheme}) => {
    const styles = {
        container: {
            paddingTop: 35,
            paddingLeft: 35,
        },
    };
    return (
        <DetailHeader>
            <section className="row center-xs start-md" style={styles.container}>
                <div className="col-xs-12 col-md-2">
                    <div className="row center-xs">
                        <Icon muiTheme={muiTheme}/>
                    </div>
                </div>
                <div className="col-xs-12 col-md-6">
                    <Details
                        coordinators={coordinators}
                        muiTheme={muiTheme}
                        onEdit={onEdit}
                        team={team}
                    />
                </div>
            </section>
        </DetailHeader>
    );
};

TeamDetailHeader.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};
TeamDetailHeader.contextTypes = {
    muiTheme: PropTypes.object,
};

export default TeamDetailHeader;

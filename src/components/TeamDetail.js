import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';

import { routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';

import DetailContent from './DetailContent';
import StyleableComponent from './StyleableComponent';
import TeamDetailHeader from './TeamDetailHeader';

const styles = {};

@decorate(Navigation)
class TeamDetail extends StyleableComponent {

    static propTypes = {
        extendedTeam: React.PropTypes.object.isRequired,
    }

    render() {
        const { extendedTeam } = this.props;
        return (
            <div>
                <TeamDetailHeader team={extendedTeam.team} />
                <DetailContent>
                </DetailContent>
            </div>
        );
    }

}

export default TeamDetail;

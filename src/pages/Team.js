import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import ThemeManager from '../utils/ThemeManager';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import TeamDetail from '../components/TeamDetail';

@connectToStores
class Team extends React.Component {

    static propTypes = {
        descendants: React.PropTypes.array,
        flux: React.PropTypes.object.isRequired,
        team: React.PropTypes.object,
        teamMembers: React.PropTypes.array,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    static getStores(props) {
        return [props.flux.getStore('TeamStore')];
    }

    static getPropsFromStores(props) {
        const store = props.flux.getStore('TeamStore');
        const { teamId } = props.params;
        const teamProps = {
            team: store.getTeam(teamId),
            teamMembers: store.getTeamMembers(teamId),
            descendants: store.getTeamDescendants(teamId),
        };

        return _.assign(
            {},
            teamProps,
        );
    }

    componentWillMount() {
        this._fetchTeam(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.teamId !== this.props.params.teamId) {
            const props = _.assign({}, this.props, nextProps);
            this._fetchTeam(props);
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _fetchTeam(props) {
        const store = props.flux.getStore('TeamStore');
        const teamId = props.params.teamId;
        store.fetchTeam(teamId);
        store.fetchTeamMembers(teamId);
        store.fetchTeamDescendants(teamId);
    }

    _renderTeam() {
        const {
            descendants,
            team,
            teamMembers,
        } = this.props;
        if (team && teamMembers && descendants) {
            let owner;
            let members = [];

            teamMembers.forEach((member, index) => {
                if (member.user_id === team.owner_id) {
                    owner = member;
                } else {
                    members.push(member);
                }
            });
            return <TeamDetail
                        team={team}
                        owner={owner}
                        members={members}
                        descendants={descendants}
                    />;
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <section className="wrap">
                {this._renderTeam()}
            </section>
        );
    }

}

export default Team;

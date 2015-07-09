'use strict';

import teamSource from '../sources/teamSource';

class TeamStore {

    constructor() {
        this.registerAsync(teamSource);
        this.bindActions(this.alt.getActions('TeamActions'));

        this.teams = {};
        this.teamMembers = {};
        this.teamDescendants = {};
    }

    onFetchTeamSuccess(team) {
        let teams = this.getInstance().getState().teams;
        teams[team.id] = team;
        this.setState({teams});
    }

    onFetchTeamMembersSuccess(state) {
        let teamMembers = this.getInstance().getState().teamMembers;
        let members = teamMembers[state.teamId];
        if (members === undefined) {
            members = [];
        }

        teamMembers[state.teamId] = members.concat(state.profiles);
        this.setState({teamMembers});
    }

    onFetchTeamDescendantsSuccess(descendants) {
        let { teamDescendants } = this.getInstance().getState();
        descendants.forEach((descendant) => {
            let items = teamDescendants[descendant.parent_team_id];
            if (items === undefined) {
                items = [];
            }
            teamDescendants[descendant.parent_team_id] = items.concat(descendant.teams);
        });
        this.setState({teamDescendants});
    }

    static getTeam(teamId) {
        return this.getState().teams[teamId];
    }

    static getTeamMembers(teamId) {
        return this.getState().teamMembers[teamId];
    }

    static getTeamDescendants(teamId) {
        return this.getState().teamDescendants[teamId];
    }

}

export default TeamStore;

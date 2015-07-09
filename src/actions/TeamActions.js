'use strict';

class TeamActions {
    constructor() {
        this.generateActions(
            'loading',
            'fetchTeamSuccess',
            'fetchTeamError',
            'fetchTeamMembersSuccess',
            'fetchTeamMembersError',
            'fetchTeamDescendantsSuccess',
            'fetchTeamDescendantsError',
        );
    }
}

export default TeamActions;

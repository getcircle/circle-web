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
            'fetchDepartmentsSuccess',
            'fetchDepartmentsError',
        );
    }
}

export default TeamActions;

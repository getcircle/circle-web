import { merge } from 'lodash';
import { services } from 'protobufs';

/**
 * Create a team
 *
 * @param {Object} client the service client
 * @param {services.team.containers.TeamV1} team a team container
 *
 * Example of how to call:
 *
 * const name = 'team name';
 * const descriptionText = 'description here';
 * const team = new services.team.containers.TeamV1({name: name, description: {value: descriptionText});
 * createTeam(client, team);
 */
export function createTeam(client, team, members) {
    const parameters = {team};
    if (members) {
        parameters.members = members;
    }
    const request = new services.team.actions.create_team.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(
                resolve,
                reject,
                response.result.team.id,
                { collectionId: response.result.collection.id },
            ))
            .catch(error => reject(error));
    });
}

/**
 * Add members to a team
 *
 * @param {Object} client service client
 * @param {String} teamId id of the team
 * @param {Array[services.team.containers.TeamMemberV1]} members members to add to the team
 */
export function addMembers(client, teamId, members) {
    const request = new services.team.actions.add_members.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
        members: members,
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, teamId))
            .catch(error => reject(error));
    });
};

/**
 * Get a team
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 *
 */
export function getTeam(client, teamId) {
    const request = new services.team.actions.get_team.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                const member = response.result.member;
                response.finish(resolve, reject, teamId, { member });
            })
            .catch(error => reject(error));
    });
}

/**
 * Return the key used to cache team members with the given role.
 *
 * @param {String} teamId the id of the team
 * @param {services.team.containers.TeamMemberV1.RoleV1} role the member role we want to return
 *
 */
export function getMembersCacheKey(teamId, role) {
    return `${teamId}:${role}`;
}

/**
 * Get team members with the given role
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 * @param {services.team.containers.TeamMemberV1.RoleV1} role the member role we want to return
 *
 */
export function getMembers(client, teamId, role = services.team.containers.TeamMemberV1.RoleV1.MEMBER, nextRequest = null) {
    const request = nextRequest ? nextRequest : new services.team.actions.get_members.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
        role: role,
        inflations: new services.common.containers.InflationsV1({exclude: ['[]members.team']}),
    });
    const cacheKey = getMembersCacheKey(teamId, role);
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, cacheKey))
            .catch(error => reject(error));
    });
}

/**
 * Get the team member objects for the given profile id
 *
 * @param {Object} client the service client
 * @param {String} profileId the id of the profile
 * @param {Bool} isCurrentUser boolean for whether or not this is the current user
 *
 */
export function getMembersForProfileId(client, profileId, isCurrentUser) {
    const request = new services.team.actions.get_members.RequestV1({
        /*eslint-disable camelcase*/
        profile_id: profileId,
        /*eslint-enable camelcase*/
        fields: new services.common.containers.FieldsV1({
            only: [
                '[]members.team_id',
                '[]members.team.id',
                '[]members.team.name',
                '[]members.id',
                '[]members.role',
            ],
        }),
        inflations: new services.common.containers.InflationsV1({
            only: [
                '[]members.team',
                '[]members.team.total_members',
            ],
        }),
    });
    return new Promise((resolve, reject) => {
        client.send(request, true)
            .then(response => response.finish(resolve, reject, profileId, { isCurrentUser }))
            .catch(error => reject(error));
    });
}

/**
 * Update a team
 *
 * @param {Object} client the service client
 * @param {services.team.containers.TeamV1} team a team container
 *
 * Example of how to call:
 *
 * (with an existing team object)
 * team.name = 'new name'
 * team.description.value = 'new description'
 *
 * const contact_method = new services.team.containers.ContactMethodV1({
 *      value: 'michael@lunohq.com',
 *      type: services.team.containers.ContactMethodV1.TypeV1.EMAIL,
 * });
 * team.contact_methods.push(contact_method)
 * updateTeam(client, team);
 */
export function updateTeam(client, team) {
    const request = new services.team.actions.update_team.RequestV1({team});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, team))
            .catch(error => reject(error));
    });
}

/**
 * Update members
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 * @param {Array[services.team.containers.TeamMemberV1]} members an array of team members
 *
 * Example of how to call:
 *
 * (with an existing team member object)
 * member.role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
 * updateMembers(client, [member]);
 */
export function updateMembers(client, teamId, members) {
    const request = new services.team.actions.update_members.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
        members,
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, teamId))
            .catch(error => reject(error));
    });
}

/**
 * Remove members
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 * @param {Array[String]} profileIds an array of the profile ids of members to remove
 *
 */
export function removeMembers(client, teamId, members) {
    const request = new services.team.actions.remove_members.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        profile_ids: members.map(member => member.profile.id),
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                if (response.isSuccess()) {
                    resolve({teamId, members});
                } else {
                    reject(response.reject());
                }
            })
            .catch(error => reject(error));
    });
}

/**
 * Join team
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 *
 */
export function joinTeam(client, teamId) {
    const joinRequest = new services.team.actions.join_team.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(joinRequest)
            .then(response => response.finish(resolve, reject, teamId, { member: response.result.member }))
            .catch(error => reject(error));
    });
}

/**
 * Leave team
 *
 * @param {Object} client the service client
 * @param {String} teamId the id of the team
 * @param {services.team.containers.TeamMemberV1} member team member
 *
 */
export function leaveTeam(client, teamId, member) {
    const leaveRequest = new services.team.actions.leave_team.RequestV1({
        /*eslint-disable camelcase*/
        team_id: teamId,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(leaveRequest)
            .then(response => {
                if (response.isSuccess()) {
                    resolve(merge(response, { teamId, member }));
                } else {
                    reject(response.reject());
                }
            })
            .catch(error => reject(error));
    });
}

export function getTeams(client, nextRequest, key) {
    const request = nextRequest ? nextRequest : new services.team.actions.get_teams.RequestV1();
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

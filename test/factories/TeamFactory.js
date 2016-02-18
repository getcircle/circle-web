import faker from 'faker';
import { services } from 'protobufs';

import ProfileFactory from './ProfileFactory';

const allPermissions = new services.common.containers.PermissionsV1({
    /*eslint-disable camelcase*/
    can_edit: true,
    can_delete: true,
    can_add: true,
    /*eslint-enable camelcase*/
});

const noPermissions = new services.common.containers.PermissionsV1({
    /*eslint-disable camelcase*/
    can_edit: false,
    can_delete: false,
    can_add: false,
    /*eslint-enable camelcase*/
});

export default {

    getTeam(overrides = {}, hasPermissions = false) {
        if (hasPermissions) {
            overrides.permissions = allPermissions;
        } else {
            overrides.permissions = noPermissions;
        }

        const params = {
            id: faker.random.uuid(),
            name: faker.hacker.noun(),
            description: {
                value: faker.lorem.paragraph(),
            },
            ...overrides,
        };
        return new services.team.containers.TeamV1(params);
    },

    getTeamMember(role = services.team.containers.TeamMemberV1.RoleV1.MEMBER, profile = ProfileFactory.getProfile()) {
        return new services.team.containers.TeamMemberV1({
            /*eslint-disable camelcase*/
            profile_id: profile.id,
            /*eslint-enable camelcase*/
            role: role,
            profile: profile,
            team: this.getTeam(),
        });
    },

    getMembers(number, role = services.team.containers.TeamMemberV1.RoleV1.MEMBER) {
        const members = [];
        for (let i = 0; i < number; i++) {
            members.push(this.getTeamMember(role));
        }
        return members;
    },

    getCoordinators(number) {
        return this.getMembers(number, services.team.containers.TeamMemberV1.RoleV1.COORDINATOR);
    },

    getTeams(number, hasPermissions = false) {
        const teams = [];
        for (let i = 0; i < number; i++) {
            teams.push(this.getTeam(undefined, hasPermissions));
        }
        return teams;
    },

}

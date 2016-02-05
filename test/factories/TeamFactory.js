import faker from 'faker';
import { services } from 'protobufs';

import ProfileFactory from './ProfileFactory';

export default {

    getTeam() {
        return new services.team.containers.TeamV1({
            id: faker.random.uuid(),
            name: faker.hacker.noun(),
        });
    },

    getTeamMember(role = services.team.containers.TeamMemberV1.RoleV1.MEMBER, profile = ProfileFactory.getProfile()) {
        return new services.team.containers.TeamMemberV1({
            /*eslint-disable camelcase*/
            profile_id: profile.id,
            /*eslint-enable camelcase*/
            role: role,
            profile: profile,
        });
    },

    getTeamMembers(number, role = services.team.containers.TeamMember.RoleV1.MEMBER) {
        const members = [];
        for (let i = 0; i < number; i++) {
            members.push(this.getTeamMember(role));
        }
        return members;
    }

}

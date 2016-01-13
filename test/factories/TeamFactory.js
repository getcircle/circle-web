import faker from 'faker';
import { services } from 'protobufs';

export default {

    getTeam() {
        const teamName = faker.hacker.noun();
        const displayName = `${teamName} (${faker.hacker.noun()})`;
        return new services.organization.containers.TeamV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            name: teamName,
            display_name: displayName,
            /*eslint-enable camelcase*/
        });
    }

}

import faker from 'faker';
import { services } from 'protobufs';

export default {

    getTeam() {
        return new services.team.containers.TeamV1({
            id: faker.random.uuid(),
            name: faker.hacker.noun(),
        });
    }

}

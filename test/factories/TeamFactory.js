import faker from 'faker';
import { services } from 'protobufs';

class TeamFactory {

    constructor() {
        this._team = new services.organization.containers.TeamV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            name: faker.hacker.noun(),
            /*eslint-enable camelcase*/
        });
    }

    getTeam() {
        return this._team;
    }
}

export default new TeamFactory();

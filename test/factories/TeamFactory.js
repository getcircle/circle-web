import faker from 'faker';
import { services } from 'protobufs';

class TeamFactory {

    constructor() {
        const teamName = faker.hacker.noun();
        this._team = new services.organization.containers.TeamV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            name: teamName,
            display_name: teamName,
            /*eslint-enable camelcase*/
        });
    }

    getTeam() {
        return this._team;
    }
}

export default new TeamFactory();

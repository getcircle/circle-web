import faker from 'faker';
import { services } from 'protobufs';

class OrganizationFactory {

    constructor() {
        this._organization = new services.organization.containers.OrganizationV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            name: faker.company.companyName(),
            domain: faker.internet.domainName(),
            image_url: faker.image.imageUrl(),
            profile_count: faker.random.number(),
            team_count: faker.random.number(),
            location_count: faker.random.number(),
            post_count: faker.random.number(),
            /*eslint-enable camelcase*/
        });
    }

    getOrganization() {
        return this._organization;
    }
}

export default new OrganizationFactory();

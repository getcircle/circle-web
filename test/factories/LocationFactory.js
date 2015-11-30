import faker from 'faker';
import { services } from 'protobufs';

class LocationFactory {

    constructor() {
        const locationName = faker.hacker.noun();
        this._location = new services.organization.containers.LocationV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            name: locationName,
            address_1: faker.address.streetAddress(),
            address_2: faker.address.secondaryAddress(),
            city: faker.address.city(),
            region: faker.address.state(),
            postal_code: faker.address.zipCode(),
            country_code: faker.address.countryCode(),
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            timezone: 'America/Los_Angeles',
            organization_id: faker.random.uuid(),
            profile_count: 500,
            /*eslint-enable camelcase*/
        });
    }

    getLocation() {
        return this._location;
    }
}

export default new LocationFactory();

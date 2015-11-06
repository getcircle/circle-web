import faker from 'faker';
import { services } from 'protobufs';

class ProfileFactory {

    constructor() {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        this._profile = new services.profile.containers.ProfileV1({
            /*eslint-disable camelcase*/
            email: faker.internet.email(),
            first_name: firstName,
            last_name: lastName,
            full_name: firstName + ' ' + lastName,
            title: faker.name.title(),
            image_url: faker.image.imageUrl(),
            /*eslint-enable camelcase*/
        });
    }

    getProfile() {
        return this._profile;
    }
}

export default new ProfileFactory();

import faker from 'faker';
import { services } from 'protobufs';

class ProfileFactory {

    constructor() {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const title = faker.name.title();
        this._profile = new services.profile.containers.ProfileV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            email: faker.internet.email(),
            first_name: firstName,
            last_name: lastName,
            full_name: firstName + ' ' + lastName,
            title: title,
            display_title: title,
            image_url: faker.image.imageUrl(),
            /*eslint-enable camelcase*/
        });
    }

    getProfile() {
        return this._profile;
    }

    getAdminProfile() {
        return Object.assign({}, this._profile, {
            /*eslint-disable camelcase*/
            is_admin: true,
            /*eslint-enable camelcase*/
        });
    }
}

export default new ProfileFactory();

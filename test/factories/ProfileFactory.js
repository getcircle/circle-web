import faker from 'faker';
import { services } from 'protobufs';

export default {

    getProfile(overrides) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const title = faker.name.title();
        return new services.profile.containers.ProfileV1({
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
            ...overrides,
        });
    },

    getAdminProfile() {
        /*eslint-disable camelcase*/
        return this.getProfile({is_admin: true});
        /*eslint-enable camelcase*/
    }
}

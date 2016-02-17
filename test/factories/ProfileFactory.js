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
    },

    getProfiles(number) {
        const profiles = [];
        for (let i = 0; i < number; i++) {
            profiles.push(this.getProfile());
        }
        return profiles;
    },

    getProfileWithContactMethods(types, overrides) {
        /*eslint-disable camelcase*/
        const methods = [];
        for (let type of types) {
            const method = this.getProfileContactMethod({contact_method_type: type});
            methods.push(method);
        }
        return this.getProfile({contact_methods: methods});
        /*eslint-enable camelcase*/
    },

    getProfileContactMethod(overrides) {
        /*eslint-disable camelcase*/
        return new services.profile.containers.ContactMethodV1({
            value: faker.internet.email(),
            contact_method_type: 0,
            ...overrides
        });
        /*eslint-enable camelcase*/
    },

}

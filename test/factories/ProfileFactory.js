import { services } from 'protobufs';

class ProfileFactory {

    constructor() {
        this._profile = new services.profile.containers.ProfileV1({
            /*eslint-disable camelcase*/
            first_name: 'Ravi',
            last_name: 'Rani',
            full_name: 'Ravi Rani',
            title: 'Co-founder @ Luno',
            image_url: 'https://dev-lunohq-media.s3.amazonaws.com/organizations/acme.png',
            /*eslint-enable camelcase*/
        });
    }

    getProfile() {
        return this._profile;
    }
}

export default new ProfileFactory();

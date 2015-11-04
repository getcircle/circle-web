import { services } from 'protobufs';

class ProfileFactory {

    constructor() {
        this._profile = new services.profile.containers.ProfileV1({
            /*eslint-disable camelcase*/
            email: 'ravi@lunohq.com',
            first_name: 'Ravi',
            last_name: 'Rani',
            /*eslint-enable camelcase*/
        });
    }

    getProfile() {
        return this._profile;
    }
}

export default new ProfileFactory();

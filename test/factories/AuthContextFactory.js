import LocationFactory from './LocationFactory';
import OrganizationFactory from './OrganizationFactory';
import ProfileFactory from './ProfileFactory';

export default {

    getContext(
        location = LocationFactory.getLocation(),
        organization = OrganizationFactory.getOrganization(),
        profile = ProfileFactory.getProfile(),
    ) {
        return {
            location,
            organization,
            profile,
        };
    }
}

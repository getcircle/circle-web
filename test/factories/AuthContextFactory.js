import LocationFactory from './LocationFactory';
import OrganizationFactory from './OrganizationFactory';
import ProfileFactory from './ProfileFactory';

export default {

    getContext(
        location = LocationFactory.getLocation(),
        managesTeam = null,
        organization = OrganizationFactory.getOrganization(),
        profile = ProfileFactory.getProfile(),
        team = null,
    ) {
        return {
            location,
            managesTeam,
            organization,
            profile,
            team,
        };
    }
}

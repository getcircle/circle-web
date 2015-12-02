import faker from 'faker';
import { services } from 'protobufs';

import LocationFactory from './LocationFactory';
import ProfileFactory from './ProfileFactory';
import TeamFactory from './TeamFactory';

class SearchResultFactory {

    constructor() {
        this._result = new services.search.containers.SearchResultV1({
            group: null,
            highlight: null,
            location: null,
            post: null,
            profile: null,
            team: null,
            score: faker.random.number(),
        });
    }

    getSearchResultWithProfile(highlightName, highlightTitle) {
        const profile = ProfileFactory.getProfile();
        const highlightedProperties = {};
        if (highlightName) {
            /*eslint-disable camelcase*/
            highlightedProperties['full_name'] = '<mark>' + profile.full_name.substr(0, 2) + '</mark>' + profile.full_name.substr(2);
            /*eslint-enable camelcase*/
        }

        if (highlightTitle) {
            /*eslint-disable camelcase*/
            highlightedProperties['display_title'] = '<mark>' + profile.display_title.substr(0, 2) + '</mark>' + profile.display_title.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlightedProperties,
            profile: profile,
            score: faker.random.number(),
        });
    }

    getSearchResultWithTeam(highlightName) {
        const team = TeamFactory.getTeam();
        const highlightedProperties = {};
        if (highlightName) {
            /*eslint-disable camelcase*/
            highlightedProperties['display_name'] = '<mark>' + team.display_name.substr(0, 2) + '</mark>' + team.display_name.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlightedProperties,
            team: team,
            score: faker.random.number(),
        });
    }

    getSearchResultWithLocation(highlightName, highlightAddress) {
        const location = LocationFactory.getLocation();
        const highlightedProperties = {};
        if (highlightName) {
            /*eslint-disable camelcase*/
            highlightedProperties.name = '<mark>' + location.name.substr(0, 2) + '</mark>' + location.name.substr(2);
            /*eslint-enable camelcase*/
        }

        if (highlightAddress) {
            const fullAddress = [location.address_1, location.address_2, location.city, location.region, location.postal_code, location.country_code].join(', ');
            /*eslint-disable camelcase*/
            highlightedProperties['full_address'] = '<mark>' + fullAddress.substr(0, 2) + '</mark>' + fullAddress.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlightedProperties,
            location: location,
            score: faker.random.number(),
        });
    }
}

export default new SearchResultFactory();

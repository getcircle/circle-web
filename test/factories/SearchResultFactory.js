import faker from 'faker';
import { services } from 'protobufs';

import ProfileFactory from './ProfileFactory';

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
            highlightedProperties['full_name'] = '<em>' + profile.full_name.substr(0, 2) + '</em>' + profile.full_name.substr(2);
            /*eslint-enable camelcase*/
        }

        if (highlightTitle) {
            /*eslint-disable camelcase*/
            highlightedProperties['display_title'] = '<em>' + profile.display_title.substr(0, 2) + '</em>' + profile.display_title.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlightedProperties,
            profile: profile,
            score: faker.random.number(),
        });
    }
}

export default new SearchResultFactory();

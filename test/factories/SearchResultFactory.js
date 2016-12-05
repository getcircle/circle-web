import faker from 'faker';
import { services } from 'protobufs';

import LocationFactory from './LocationFactory';
import PostFactory from './PostFactory';
import ProfileFactory from './ProfileFactory';

export default {

    getSearchResultWithProfile(highlightName, highlightTitle) {
        const profile = ProfileFactory.getProfile();
        const highlight = {};
        if (highlightName) {
            /*eslint-disable camelcase*/
            highlight['full_name'] = '<mark>' + profile.full_name.substr(0, 2) + '</mark>' + profile.full_name.substr(2);
            /*eslint-enable camelcase*/
        }

        if (highlightTitle) {
            /*eslint-disable camelcase*/
            highlight['display_title'] = '<mark>' + profile.display_title.substr(0, 2) + '</mark>' + profile.display_title.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlight,
            profile: profile,
            score: faker.random.number(),
        });
    },

    getSearchResultWithLocation(highlightName, highlightAddress) {
        const location = LocationFactory.getLocation();
        const highlight = {};
        if (highlightName) {
            /*eslint-disable camelcase*/
            highlight.name = '<mark>' + location.name.substr(0, 2) + '</mark>' + location.name.substr(2);
            /*eslint-enable camelcase*/
        }

        if (highlightAddress) {
            const fullAddress = [location.address_1, location.address_2, location.city, location.region, location.postal_code, location.country_code].join(', ');
            /*eslint-disable camelcase*/
            highlight['full_address'] = '<mark>' + fullAddress.substr(0, 2) + '</mark>' + fullAddress.substr(2);
            /*eslint-enable camelcase*/
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlight,
            location: location,
            score: faker.random.number(),
        });
    },

    getSearchResultWithPost(highlightTitle, highlightContent) {
        const post = PostFactory.getPost();
        const highlight = {
            content: post.snippet,
        };
        if (highlightTitle) {
            highlight.title = `<mark>${post.title.substr(0, 3)}</mark>${post.title.substr(3)}`;
        }

        if (highlightContent) {
            highlight.content = `<mark>${post.content.substr(0, 3)}</mark>${post.title.substr(3, 80)}`;
        }

        return new services.search.containers.SearchResultV1({
            highlight: highlight,
            post: post,
            score: faker.random.number(),
        });
    }

}

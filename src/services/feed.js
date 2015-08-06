import {services} from 'protobufs';

import client from './client';
import logger from '../utils/logger';

function _getFeed(request) {
	return new Promise((resolve, reject) => {
		client.sendRequest(request)
			.then((response) => {
				let {categories} = response.result;
				resolve({categories});
			})
			.catch((error) => {
				logger.log(`Error fetching feed: ${error}`);
				reject(error);
			});
	});
}

export function getProfileFeed() {
	let request = new services.feed.actions.get_profile_feed.RequestV1();
	return _getFeed(request);
}

export function getOrganizationFeed() {
	let request = new services.feed.actions.get_organization_feed.RequestV1();
	return _getFeed(request);
}

import {services} from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function getProfile(parameters) {
	let request = new services.profile.actions.get_profile.RequestV1(parameters);
	return new Promise((resolve, reject) => {
		client.sendRequest(request)
			.then((response) => {
				let {profile} = response.result;
				resolve(profile);
			})
			.catch((error) => {
				logger.log(`Error fetching profile: ${error}`);
				reject(error);
			});
	});
}

export function getProfileWithUserId(userId) {
	/*eslint-disable camelcase*/
	return getProfile({user_id: userId});
	/*eslint-enable camelcase*/
}

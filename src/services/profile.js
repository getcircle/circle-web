'use strict';

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

export function getProfiles(nextRequest=null) {
    return new Promise((resolve, reject) => {
        if (nextRequest === null) {
            let request = new services.profile.actions.get_profiles.RequestV1();
            client.sendRequest(request)
                .then((response) => {
                    let {profiles} = response.result;
                    resolve({profiles, nextRequest: response.getNextRequest()});
                })
                .catch((error) => {
                    logger.log(`Error fetching profiles: ${error}`);
                    reject(error);
                });
        } else {
            client.sendNextRequest(nextRequest)
                .then((response) => {
                    let {profiles} = response.result;
                    resolve({profiles, nextRequest: response.getNextRequest()});
                })
                .catch((error) => {
                    logger.log(`Error fetching profiles: ${error}`);
                });
        }
    });

}

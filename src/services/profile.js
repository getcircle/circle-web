'use strict';

import _ from 'lodash';
import { services } from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function getProfile(parameters) {
	let request = new services.profile.actions.get_profile.RequestV1(parameters);
	return new Promise((resolve, reject) => {
		client.sendRequest(request)
			.then((response) => {
                if (response.errors.length) {
                    let { errors, errorDetails } = response;
                    return reject({errors, errorDetails});
                }

				let { profile } = response.result;
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

export function getProfiles(parameters, nextRequest=null) {
    parameters = _.assign({}, parameters);
    // XXX is there a way to make this more DRY?
    return new Promise((resolve, reject) => {
        if (nextRequest === null) {
            let request = new services.profile.actions.get_profiles.RequestV1(parameters);
            client.sendRequest(request)
                .then((response) => {
                    let {profiles} = response.result;
                    resolve({
                        parameters,
                        profiles,
                        nextRequest: response.getNextRequest(),
                    });
                })
                .catch((error) => {
                    logger.log(`Error fetching profiles: ${error}`);
                    reject(error);
                });
        } else {
            client.sendNextRequest(nextRequest)
                .then((response) => {
                    let {profiles} = response.result;
                    resolve({
                        parameters,
                        profiles,
                        nextRequest: response.getNextRequest(),
                    });
                })
                .catch((error) => {
                    logger.log(`Error fetching profiles: ${error}`);
                });
        }
    });

}

export function getExtendedProfile(profileId) {
    /*eslint-disable camelcase*/
    let request = new services.profile.actions.get_extended_profile.RequestV1({profile_id: profileId});
    /*eslint-enable camelcase*/
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let extendedProfile = response.result;
                resolve(extendedProfile);
            })
            .catch((error) => {
                logger.log(`Error fetching extended profile: ${error}`);
            });
    });
}

export function getInitialsForProfile(profile) {
    return [profile.first_name[0], profile.last_name[0]].map((character) => _.capitalize(character)).join('');
}

export function getProfilesForTeamId(teamId, nextRequest) {
    /*eslint-disable camelcase*/
    let parameters = {
        team_id: teamId,
    };
    /*eslint-enable camelcase*/

    // TODO do something with nextRequest

    let request = new services.profile.actions.get_profiles.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { profiles } = response.result;
                resolve({
                    profiles,
                    teamId,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.log(`Error fetching profliles for team: ${error}`);
            });
    });
}

export function getProfilesForLocationId(locationId, nextRequest) {
    let parameters = {
        'location_id': locationId,
    };

    // TODO do something with nextRequest
    let request = new services.profile.actions.get_profiles.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { profiles } = response.result;
                resolve({
                    profiles,
                    locationId,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.error(`Error fetching profiles for location: ${error}`);
            });
    });
}

export function getProfilesForTagId(tagId, nextRequest) {
    let parameters = {
        'tag_id': tagId,
    };

    // TODO do something with nextRequest
    let request = new services.profile.actions.get_profiles.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { profiles } = response.result;
                resolve({
                    profiles,
                    tagId,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.error(`Error fetching profiles for tag: ${error}`);
            });
    });
}

export function getTag(tagId) {
    let parameters = {
        ids: [tagId],
    };

    let request = new services.profile.actions.get_tags.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { tags } = response.result;
                resolve(tags[0]);
            })
            .catch((error) => {
                logger.error(`Error fetching tag: ${error}`);
            });
    });
}


import _ from 'lodash';
import { services } from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function getProfile(parameters={}) {
    let key = Object.values(parameters)[0];
	let request = new services.profile.actions.get_profile.RequestV1(parameters);
	return new Promise((resolve, reject) => {
		client.sendRequest(request)
			.then((response) => {
                if (response.isSuccess()) {
                    key = response.result.profile.id;
                }
                response.finish(resolve, reject, key)
            })
            .catch(error => reject(error));
	});
}

export function getProfiles(parameters, nextRequest=null, key=null) {
    parameters = Object.assign({}, parameters);
    const request = nextRequest ? nextRequest : new services.profile.actions.get_profiles.RequestV1(parameters);
    if (key === null) {
        key = Object.values(parameters)[0];
    }
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

export function getExtendedProfile(profileId) {
    let parameters = {}
    if (profileId !== undefined) {
        /*eslint-disable camelcase*/
        parameters.profile_id = profileId;
        /*eslint-enable camelcase*/
    }

    let request = new services.profile.actions.get_extended_profile.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                let resultId = profileId;
                if (resultId === undefined && response.result && response.result.profile) {
                    resultId = response.result.profile.id;
                }

                response.finish(resolve, reject, resultId);
            })
            .catch(error => reject(error));
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

export function updateProfile(profile) {
    let request = new services.profile.actions.update_profile.RequestV1({profile: profile});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, profile))
            .catch(error => reject(error));
    });
}


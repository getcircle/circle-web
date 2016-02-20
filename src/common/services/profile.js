import _ from 'lodash';
import merge from 'lodash/object/merge';
import { services } from 'protobufs';
import * as organizationRequests from '../services/organization';

export function getProfile(client, parameters={}) {
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

export function getProfiles(client, parameters, nextRequest=null, key=null) {
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

export function getExtendedProfile(client, profileId) {
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

export function updateProfile(client, profile, manager) {
    let request = new services.profile.actions.update_profile.RequestV1({profile: profile});
    let updateProfile = new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, profile))
            .catch(error => reject(error));
    });

    if (!!manager) {
        const updateManager = new Promise((resolve, reject) => {
            organizationRequests.setManager(client, profile.id, manager.id)
                .then(() => getReportingDetails(client, profile.id))
                .then(response => resolve(response));
        });
        return new Promise((resolve, reject) => {
            Promise.all([updateProfile, updateManager])
                .then(values => resolve(merge(...values)))
                .catch(error => reject(error));
        });
    } else {
        return updateProfile;
    }
}

export function getReportingDetails(client, profileId) {
    /*eslint-disable camelcase*/
    const request = new services.profile.actions.get_reporting_details.RequestV1({profile_id: profileId});
    /*eslint-enable camelcase*/
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, profileId))
            .catch(error => reject(error));
    });
}

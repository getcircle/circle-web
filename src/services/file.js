import { services } from 'protobufs';
import requests from 'superagent';

import client from './client';
import logger from '../utils/logger';

export function uploadFile(fileName, contentType, data) {
    return new Promise((resolve, reject) => {
        let instructionsRef;
        startUpload(fileName, contentType)
            .then((instructions) => {
                instructionsRef = instructions;
                return upload(instructions.upload_url, data);
            })
            .then((response) => completeUpload(fileName, instructionsRef.upload_id, instructionsRef.upload_key))
            .then((uploadResponse) => resolve(uploadResponse))
            .catch((error) => {
                logger.log(`Error uploading file: ${error}`);
                reject(error);
            });
        });
}

function startUpload(fileName, contentType) {
    /*eslint-disable camelcase*/
    let parameters = {
        file_name: fileName,
        content_type: contentType,
    };
    /*eslint-enable camelcase*/

    let request = new services.file.actions.start_upload.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let uploadInstructions = response.result.upload_instructions;
                resolve(uploadInstructions)
            })
            .catch((error) => {
                logger.log(`Error fetching upload instructions: ${error}`);
                reject(error);
            });
    });
}

function completeUpload(fileName, uploadId, uploadKey) {
     /*eslint-disable camelcase*/
    let parameters = {
        file_name: fileName,
        upload_id: uploadId,
        upload_key: uploadKey,
    };
    /*eslint-enable camelcase*/

    let request = new services.file.actions.complete_upload.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
        .then(response => response.finish(resolve, reject))
        .catch(error => reject(error));
    });
}

function upload(url, data) {
    return new Promise((resolve, reject) => {
        requests
            .put(url, data)
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

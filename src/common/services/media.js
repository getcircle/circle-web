import { services } from 'protobufs';
import requests from 'superagent';

import logger from '../utils/logger';

export function uploadMedia(client, data, mediaType, mediaKey) {
    return new Promise((resolve, reject) => {
        let instructionsRef;
        startMediaUpload(client, mediaType, mediaKey)
            .then((instructions) => {
                instructionsRef = instructions;
                return upload(instructions.upload_url, data);
            })
            .then((response) => completeMediaUpload(
                client,
                mediaType,
                mediaKey,
                instructionsRef.upload_id,
                instructionsRef.upload_key
            ))
            .then((mediaUploadCompleteResponse) => resolve(mediaUploadCompleteResponse))
            .catch((error) => {
                logger.log(`Error uploading media: ${error}`);
                reject(error);
            });
        });
}

function startMediaUpload(client, mediaType, mediaKey) {
    /*eslint-disable camelcase*/
    let parameters = {
        media_type: mediaType,
        media_key: mediaKey,
    };
    /*eslint-enable camelcase*/

    let request = new services.media.actions.start_image_upload.RequestV1(parameters);
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

function completeMediaUpload(client, mediaType, mediaKey, uploadId, uploadKey) {
     /*eslint-disable camelcase*/
    let parameters = {
        media_type: mediaType,
        media_key: mediaKey,
        upload_id: uploadId,
        upload_key: uploadKey,
    };
    /*eslint-enable camelcase*/

    let request = new services.media.actions.complete_image_upload.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let mediaUrl = response.result.media_url;
                resolve({mediaUrl})
            })
            .catch((error) => {
                logger.log(`Error completing media upload: ${error}`);
                reject(error);
            });
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

import { services } from 'protobufs';
import requests from 'superagent';

import logger from '../utils/logger';
import { reportFileUploadProgress } from '../actions/files';

export function uploadFile(client, fileName, contentType, data, dispatch) {
    return new Promise((resolve, reject) => {
        let instructionsRef;
        startUpload(client, fileName, contentType)
            .then((instructions) => {
                instructionsRef = instructions;
                return upload(fileName, instructions.upload_url, data, dispatch);
            })
            .then((response) => completeUpload(client, fileName, instructionsRef.upload_id, instructionsRef.upload_key))
            .then((uploadResponse) => resolve(uploadResponse))
            .catch((error) => {
                logger.log(`Error uploading file: ${error}`);
                reject(error);
            });
        });
}

function startUpload(client, fileName, contentType) {
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

function completeUpload(client, fileName, uploadId, uploadKey) {
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
        .then(response => resolve(response.result.file))
        .catch(error => reject(error));
    });
}

function upload(fileName, url, data, dispatch) {
    return new Promise((resolve, reject) => {
        requests
            .put(url, data)
            .withCredentials()
            .on('progress', (event) => {
                dispatch(reportFileUploadProgress(fileName, event.percent));
            })
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

export function deleteFile(client, fileId) {
     let request = new services.file.actions.delete.RequestV1({ids: [fileId]});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => {
                if (response.isSuccess()) {
                    resolve({
                        fileId: fileId,
                    });
                } else {
                    reject('File wasn\'t deleted');
                }
            })
            .catch(error => reject(error));
    });
}

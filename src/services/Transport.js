import ByteBuffer from 'bytebuffer';
import requests, { parse } from 'superagent';

import WrappedResponse from './WrappedResponse';

// Handle arraybuffer responses
parse['application/json'] = function (str) {
    str = ByteBuffer.wrap(str).toUTF8();
    return JSON.parse(str);
}

export default class Transport {

    constructor() {
        this._token = null;
    }

    set token(value) {
        this._token = value;
    }

    get _endpoint() {
        return process.env.API_ENDPOINT;
    }

    sendRequest(request) {
        return new Promise((resolve, reject) => {
            // TODO set authorization header for authenticated requests
            requests
                .post(this._endpoint)
                .set('Authorization', this._token ? `Token ${this._token}` : '')
                .type('application/x-protobuf')
                .send(request.toArrayBuffer())
                .responseType('arraybuffer')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        // TODO should reject with failures from the service
                        // TODO should handle any decoding errors
                        let response = new WrappedResponse(request, res);
                        resolve(response);
                    }
                });
        });
    }

}

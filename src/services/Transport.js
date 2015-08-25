import keymirror from 'keymirror';
import requests from 'superagent';

import WrappedResponse from './WrappedResponse';

const ENVIRONMENTS = keymirror({
    local: null,
    production: null,
});

export default class Transport {

    constructor() {
        // TODO figure out where to put these configs
        if (~location.origin.indexOf('local')) {
            this._environment = ENVIRONMENTS.local;
        } else {
            this._environment = ENVIRONMENTS.production;
        }
        this._token = null;
    }

    set token(value) {
        this._token = value;
    }

    get _scheme() {
        switch (this._environment) {
            case ENVIRONMENTS.local:
                return 'http';
            default:
                return 'https';
        }
    }

    get _host() {
        switch (this._environment) {
            case ENVIRONMENTS.local:
                return 'localhost:8000';
            default:
                return 'api.circlehq.co';
        }
    }

    get _endpoint() {
        return `${ this._scheme }://${ this._host }`;
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

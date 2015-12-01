import ByteBuffer from 'bytebuffer';
import superagent from 'superagent';

import WrappedResponse from './WrappedResponse';

// Handle arraybuffer responses
superagent.parse['application/json'] = function (str) {
    str = ByteBuffer.wrap(str).toUTF8();
    return JSON.parse(str);
}

if (__SERVER__) {
    superagent.parse['application/x-protobuf'] = function(res, fn) {
        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('end', function() {
            fn(null, Buffer.concat(chunks));
        });
    }
}

function getBody(response) {
    if (__CLIENT__) {
        return response.xhr.response;
    } else {
        return response.body;
    }
}

function getApiEndpoint(req) {
    let origin;
    if (__CLIENT__) {
        origin = window.location.origin;
    } else {
        origin = `${req.protocol}://${req.get('host')}`;
    }
    return origin + '/api/';
}

export default class Transport {

    constructor(req) {
        this.req = req;
        this._endpoint = getApiEndpoint(req);
    }

    sendRequest(request) {
        return new Promise((resolve, reject) => {
            const data = request.toArrayBuffer();
            const _request = superagent
                .post(this._endpoint)
                .type('application/x-protobuf')

            if (__CLIENT__) {
                _request.responseType('arraybuffer')
                    .send(data);
            }

            if (__SERVER__ && this.req.get('cookie')) {
                _request.set('cookie', this.req.get('cookie'))
                    .buffer(true)
                    .send(new Buffer(data));
            }
            return _request.end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    // TODO should reject with failures from the service
                    // TODO should handle any decoding errors
                    let response = new WrappedResponse(request, res, getBody(res));
                    resolve(response);
                }
            });
        });
    }

}

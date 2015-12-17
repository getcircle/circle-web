import ByteBuffer from 'bytebuffer';
import { CookieAccessInfo } from 'cookiejar';
import superagent from 'superagent';

import raven from '../utils/raven';

import WrappedResponse from './WrappedResponse';

// Handle arraybuffer responses
superagent.parse['application/json'] = function (str) {
    str = ByteBuffer.wrap(str).toUTF8();
    return JSON.parse(str);
}

if (__SERVER__) {
    superagent.parse['application/x-protobuf'] = function (res, fn) {
        const chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
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
    if (__CLIENT__) {
        return `${window.location.origin}/api/`;
    } else {
        return process.env.REMOTE_API_ENDPOINT;
    }
}


export function ResponseError(message, response) {
    this.name = 'ResponseError';
    this.message = message || 'Response Error';
    this.stack = (new Error()).stack;
}
ResponseError.prototype = Object.create(Error.prototype);
ResponseError.prototype.constructor = ResponseError;

export default class Transport {

    constructor(req, auth) {
        this.req = req;
        this._endpoint = getApiEndpoint(req);
        if (__CLIENT__) {
            this.agent = superagent;
        } else {
            this.agent = superagent.agent();
        }
        this.auth = auth || {value: null, cookie: null};
    }

    sendRequest(request) {
        return new Promise((resolve, reject) => {
            const data = request.toArrayBuffer();
            const _request = this.agent
                .post(this._endpoint)
                .type('application/x-protobuf')

            if (__CLIENT__) {
                _request.responseType('arraybuffer')
                    .send(data);
            }

            if (__SERVER__) {
                const cookies = [];
                if (this.req.get('cookie')) {
                    cookies.push(this.req.get('cookie'));
                }
                if (this.auth) {
                    cookies.push(this.auth.value);
                }
                const cookie = cookies.join('; ');
                _request.set('cookie', cookie)
                    .buffer(true)
                    .send(new Buffer(data));
            }
            return _request.end((err, res) => {
                if (err) {
                    raven.captureException(err);
                    reject(err);
                } else if (!res.ok) {
                    raven.captureMessage('Request Failure', {
                        level: 'warning',
                        extra: {
                            res: {
                                status: res.status,
                                text: res.text,
                            },
                        },
                    });
                    reject(new ResponseError(undefined, response));
                } else {
                    if (this.agent.jar) {
                        const accessInfo = CookieAccessInfo(
                            process.env.AUTHENTICATION_TOKEN_COOKIE_DOMAIN,
                            undefined,
                            process.env.NODE_ENV === 'production',
                            false,
                        );
                        const cookie = this.agent.jar.getCookies(accessInfo);
                        if (cookie.toString()) {
                            this.auth.value = cookie.toValueString();
                            this.auth.cookie = cookie.toString();
                        }
                    }
                    // TODO should reject with failures from the service
                    // TODO should handle any decoding errors
                    let response = new WrappedResponse(request, res, getBody(res));
                    resolve(response);
                }
            });
        });
    }

}

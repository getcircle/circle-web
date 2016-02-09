import React from 'react';
import { renderToString } from 'react-dom/server';
import { trigger } from 'redial';

import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';

import Client from '../../common/services/Client';
import createStore from '../../common/createStore';
import getRoutes from '../../common/getRoutes';
import DocumentTitle from '../../common/components/DocumentTitle';
import Root from '../../common/Root';
import raven from '../../common/utils/raven';
import { getSubdomain } from '../../common/utils/subdomains';

import renderFullPage from '../renderFullPage';

const pretty = new PrettyError();

export default function (req, res) {
    if (__LOCAL__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    global.window = {
        location: {
            host: req.get('host'),
        },
        innerHeight: 0,
    };

    let auth;
    if (req.session) {
        auth = req.session.auth;
    }

    const client = new Client(req, auth);
    const store = createStore(client);

    function hydrateOnClient() {
        res.status(200).send(renderFullPage('', store, webpackIsomorphicTools.assets()));
    }

    if (__DISABLE_SSR__) {
        hydrateOnClient();
        return;
    }

    const url = {
        host: req.host,
        // window.location.protocol appends the ":"
        protocol: `${req.protocol}:`,
        raw: req.originalUrl,
        subdomain: getSubdomain(req.hostname),
    };

    match({routes: getRoutes(store, url), location: req.url}, (error, redirectLocation, renderProps) => {
        if (error) {
            raven.captureError(error);
            console.error('ROUTER ERROR:', pretty.render(error));
            res.send(500, error.message);
            hydrateOnClient();
        } else if (redirectLocation) {
            req.session.auth = client.transport.auth;
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            const locals = {
                dispatch: store.dispatch,
                getState: store.getState,
                location: renderProps.location,
                params: renderProps.params,
                url,
            };
            let content;
            let windowTitle;
            try {
                trigger('fetch', renderProps.components, locals)
                    .then(() => {
                        try {
                            content = renderToString(
                                <Root url={url} userAgent={req.headers['user-agent']}>
                                    <Provider key="provider" store={store}>
                                        <RoutingContext {...renderProps} />
                                    </Provider>
                                </Root>
                            );
                            windowTitle = DocumentTitle.rewind();
                        } catch (e) {
                            console.error('REACT RENDER ERROR:', pretty.render(e));
                            raven.captureError(e);
                            hydrateOnClient();
                            return;
                        }
                        let page;
                        try {
                            page = renderFullPage(content, store, webpackIsomorphicTools.assets(), windowTitle);
                        } catch (e) {
                            raven.captureError(e);
                            console.error('RENDER ERROR:', pretty.render(e));
                            hydrateOnClient();
                            return;
                        }
                        // If the authentication token cookie is present on the
                        // transport (happens after a SSR redirect as a result of
                        // successful authentication (SSO)), we need to tell the
                        // browser to set the cookie.
                        if (client.transport.auth.cookie) {
                            res.append('Set-Cookie', client.transport.auth.cookie);
                        }
                        // We only need the session for handling multiple requests
                        // and redirects during SSR. As soon as we return a
                        // response to the browser, we should rely on the
                        // authentication cookie set by the API. This means we
                        // don't have to manage multiple cookies or worry about
                        // invalidating multiple cookies when the user logs out.
                        req.session.destroy();
                        res.status(200).send(page);
                    })
                    .catch((error) => {
                        raven.captureError(error);
                        console.error('DATA FETCHING ERROR:', pretty.render(e));
                        hydrateOnClient();
                        return;
                    });
            } catch (e) {
                raven.captureError(e);
                console.error('DATA FETCHING ERROR:', pretty.render(e));
                hydrateOnClient();
                return;
            }
        }
    });
}

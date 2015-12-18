import React from 'react';
import ReactDOM from 'react-dom/server';

import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';

import Client from '../../common/services/Client';
import createStore from '../../common/createStore';
import getRoutes from '../../common/getRoutes';
import Root from '../../common/Root';
import raven from '../../common/utils/raven';
import { getSubdomain } from '../../common/utils/subdomains';

import fetchAllData from '../fetchAllData';
import renderFullPage from '../renderFullPage';

const pretty = new PrettyError();

export default function (req, res) {
    if (__LOCAL__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    // XXX come up with a better way to do this, possibly context?
    global.navigator = {
        userAgent: req.headers['user-agent'],
    };
    global.window = {
        location: {
            host: req.get('host'),
        },
        innerHeight: 0,
    };

    console.log('PROCESSING REQUEST: %s - %s', req.session.id, JSON.stringify(req.session.auth));
    const client = new Client(req, req.session.auth);
    const store = createStore(client);

    function hydrateOnClient() {
        res.status(200).send(renderFullPage('', store, webpackIsomorphicTools.assets()));
    }

    if (__DISABLE_SSR__) {
        hydrateOnClient();
        return;
    }

    match({routes: getRoutes(store), location: req.url}, (error, redirectLocation, renderProps) => {
        if (error) {
            raven.captureError(error);
            console.error('ROUTER ERROR:', pretty.render(error));
            res.send(500, error.message);
            hydrateOnClient();
        } else if (redirectLocation) {
            console.info('REDIRECTING AND SAVING AUTH IN SESSION: %s - %s', req.session.id, JSON.stringify(client.transport.auth));
            req.session.auth = client.transport.auth;
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            let content;
            try {
                const url = {
                    host: req.host,
                    // window.location.protocol appends the ":"
                    protocol: `${req.protocol}:`,
                    raw: req.originalUrl,
                    subdomain: getSubdomain(req.hostname),
                };
                fetchAllData(
                    renderProps.components,
                    store.getState,
                    store.dispatch,
                    renderProps.location,
                    renderProps.params,
                    url
                ).then(() => {
                    try {
                        content = ReactDOM.renderToString(
                            <Root url={url}>
                                <Provider key="provider" store={store}>
                                    <RoutingContext {...renderProps} />
                                </Provider>
                            </Root>
                        );
                    } catch (e) {
                        console.error('REACT RENDER ERROR:', pretty.render(e));
                        raven.captureError(e);
                        hydrateOnClient();
                        return;
                    }
                    let page;
                    try {
                        page = renderFullPage(content, store, webpackIsomorphicTools.assets());
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
            } catch (e) {
                raven.captureError(e);
                console.error('DATA FETCHING ERROR:', pretty.render(e));
                hydrateOnClient();
                return;
            }
        }
    });
}

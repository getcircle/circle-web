import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';

import Client from '../common/services/client';
import createStore from '../common/createStore';
import getRoutes from '../common/getRoutes';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';
import renderFullPage from './renderFullPage';
import Root from '../common/Root';

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

// Serve static assets
app.use(compression());
app.use(favicon(path.join(__dirname, '../..', 'static', 'images', 'favicon.ico')));
app.use(require('serve-static')(path.join(__dirname, '../..', 'static')));

app.use((req, res) => {
    if (__LOCAL__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    global.navigator = {
        userAgent: req.headers['user-agent'],
    };

    const client = new Client(req);
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
            console.error('ROUTER ERROR:', pretty.render(error));
            res.send(500, error.message);
            hydrateOnClient();
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            let content;
            try {
                content = ReactDOM.renderToString(
                    <Root>
                        <Provider key="provider" store={store}>
                            <RoutingContext {...renderProps} />
                        </Provider>
                    </Root>
                );
            } catch (e) {
                console.error('REACT RENDER ERROR:', pretty.render(e));
                hydrateOnClient();
                return;
            }
            let page;
            try {
                page = renderFullPage(content, store, webpackIsomorphicTools.assets());
            } catch (e) {
                console.error('RENDER ERROR:', pretty.render(e));
                hydrateOnClient();
                return;
            }
            res.status(200).send(page);
        }
    });
});

server.listen(3000, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('==> Open http://localhost:%s in a browser to view the app.', 3000);
});

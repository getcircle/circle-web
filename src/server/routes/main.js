import React from 'react';
import ReactDOM from 'react-dom/server';

import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';

import Client from '../../common/services/client';
import createStore from '../../common/createStore';
import getRoutes from '../../common/getRoutes';
import Root from '../../common/Root';

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
                fetchAllData(
                    renderProps.components,
                    store.getState,
                    store.dispatch,
                    renderProps.location,
                    renderProps.params
                ).then(() => {
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
                })
            } catch (e) {
                console.error('DATA FETCHING ERROR:', pretty.render(e));
                hydrateOnClient();
                return;
            }
        }
    });
}

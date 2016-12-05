import protobufs from 'protobufs';
import transit from 'transit-immutable-protobuf-js';

import raven from '../common/utils/raven';

const nameSpaces = transit.withNameSpaces(
    [protobufs.soa, protobufs.services],
    new protobufs.services.$type.clazz().constructor,
);

export default function (content, store, assets, title) {
    const styleAssets = Object.keys(assets.styles).map((style, key) => {
        return (
            `<link
                charSet="UTF-8"
                href=${assets.styles[style]}
                media="screen, projection"
                rel="stylesheet"
                type="text/css"
            />`
        );
    });
    let styles = styleAssets.length !== 0 ? styleAssets : '';
    if (!styles) {
        styles = `<style>${require('../common/styles/app.scss')}</style>`;
    }

    let serializedState = '';
    if (!__DISABLE_SSR__) {
        try {
            serializedState = nameSpaces.toJSON(store.getState());
        } catch (e) {
            raven.captureException(e);
        }
    }

    const windowTitle = title || '';
    return `
    <!doctype html>
    <html lang="en-us">
        <head>
            <meta charset="utf-8">
            <meta name="author" content="Luno">
            <meta name="description" content="Organizing your company's knowledge.">
            <title>${windowTitle}</title>
            <!-- Load Fonts -->
            <link href='https://fonts.googleapis.com/css?family=Lato:400,900,400italic,700italic,700' rel='stylesheet' type='text/css'>
            <!-- End Load Fonts -->

            ${styles}
            <!-- Begin Google Log In -->
            <script type="text/javascript" src="https://apis.google.com/js/client.js" async defer></script>
            <!-- End Google Log In -->

            <!-- Begin Mixpanel -->
            <script type="text/javascript" src="/js/mixpanel.js" async defer></script>
            <!-- End Mixpanel -->
        </head>
        <body class="layout">
            <div class="js-content">${content}</div>
            <script>
                window.__INITIAL_STATE='${serializedState}';
            </script>
            <script src="${assets.javascript.main}"></script>
        </body>
    </html>
    `;
};

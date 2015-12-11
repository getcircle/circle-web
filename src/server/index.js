import compression from 'compression';
import Express from 'express';
import http from 'http';
import httpProxy from 'http-proxy';
import path from 'path';
import PrettyError from 'pretty-error';
import favicon from 'serve-favicon';

import main from './routes/main';

const PORT = process.env.PORT || 3000;

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', '..', 'static', 'images', 'favicon.ico')));

app.use(require('serve-static')(path.join(__dirname, '..', '..', 'static')));

const proxy = httpProxy.createProxyServer({
    target: process.env.REMOTE_API_ENDPOINT,
});
app.use('/api', (req, res) => {
    try {
        proxy.web(req, res);
    } catch (e) {
        console.error('ERROR PROXING API:', pretty.render(e));
    }
});

app.use((req, res) => {
    try {
        main(req, res);
    } catch (e) {
        console.log('ERROR PROCESSING REQUEST:', pretty.render(e));
    }
});

server.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('--> Starting server at: http://0.0.0.0:%s', PORT);
});

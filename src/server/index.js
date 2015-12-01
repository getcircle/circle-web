import Express from 'express';
import PrettyError from 'pretty-error';
import http from 'http';
import httpProxy from 'http-proxy';

import main from './routes/main';


const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

if (__LOCAL__) {
    // in dev/production we use nginx as a proxy
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
}

app.use((req, res) => {
    try {
        main(req, res);
    } catch (e) {
        console.log('ERROR PROCESSING REQUEST:', pretty.render(e));
    }
});

server.listen(3000, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('--> Starting server at: http://0.0.0.0:%s', 3000);
});

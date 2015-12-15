import compression from 'compression';
import connectRedis from 'connect-redis';
import Express from 'express';
import session from 'express-session';
import http from 'http';
import httpProxy from 'http-proxy';
import morgan from 'morgan';
import path from 'path';
import PrettyError from 'pretty-error';
import favicon from 'serve-favicon';

import main from './routes/main';
import validateConfig from './validateConfig';

const requiredKeys = ['SESSION_SECRET', 'REDIS_URL'];

const PORT = process.env.PORT || 3000;

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const RedisStore = connectRedis(session);

const sess = {
    cookie: {},
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({url: process.env.REDIS_URL}),
}

if (app.get('env') === 'production') {
    sess.cookie.secure = true;
}

// Setup basic http auth for our dev environment to restrict access to admins
if (process.env.NODE_ENV === 'development') {
    requiredKeys.push('ADMIN_USERNAME', 'ADMIN_PASSWORD');
    const auth = require('http-auth');
    const basic = auth.basic({
        realm: 'luno'
    }, (username, password, callback) => {
        callback(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD);
    });
    app.use(auth.connect(basic));
}

app.use(morgan(':remote-addr :method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
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

app.use(session(sess));

app.use((req, res) => {
    try {
        main(req, res);
    } catch (e) {
        console.log('ERROR PROCESSING REQUEST:', pretty.render(e));
    }
});

validateConfig(requiredKeys);
server.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('--> Starting server at: http://0.0.0.0:%s', PORT);
});

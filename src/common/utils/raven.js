let client;
if (__CLIENT__) {
    client = require('raven-js');
    client.config(process.env.SENTRY_DSN).install();
} else {
    const raven = require('raven');
    client = new raven.Client();
}

export default client;

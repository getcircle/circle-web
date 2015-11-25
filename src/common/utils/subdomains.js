export function getSubdomain() {
    // TODO need to figure out a way to do this when server side rendering as
    // well
    if (__CLIENT__) {
        const { host } = window.location;
        const subdomain = host.split('.')[0];
        if (subdomain !== 'www') {
            return subdomain;
        }
    }
}

export function getSubdomain() {
    const { host } = window.location;
    const subdomain = host.split('.')[0];
    if (subdomain !== 'www') {
        return subdomain;
    }
}

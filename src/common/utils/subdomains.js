const SUBDOMAIN_IGNORE_VALUES = ['www', 'local', 'dev', 'staging'];

export function getSubdomain(host) {
    const parts = host.split('.');
    const subdomain = parts[0];
    if (parts.length > 2 && SUBDOMAIN_IGNORE_VALUES.indexOf(subdomain) === -1) {
        return subdomain;
    }
}

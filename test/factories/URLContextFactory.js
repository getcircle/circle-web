
export default {

    getContext(
        raw = 'https://team.lunohq.com',
        protocol = 'https:',
        host = 'lunohq.com',
        subdomain = 'team',
    ) {
        return {
            raw,
            protocol,
            host,
            subdomain,
        };
    }
}

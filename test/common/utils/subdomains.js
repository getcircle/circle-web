import expect from 'expect';

import { getSubdomain } from '../../../src/common/utils/subdomains';

describe('subdomain utils', () => {
    describe('getSubdomain', () => {
        it('correctly doesn\'t return a value for environment hosts', () => {
            let subdomain = getSubdomain('local.lunohq.com:3000')
            expect(subdomain).toNotExist();
            subdomain = getSubdomain('dev.lunohq.com')
            expect(subdomain).toNotExist();
            subdomain = getSubdomain('staging.lunohq.com')
            expect(subdomain).toNotExist();
            subdomain = getSubdomain('lunohq.com');
            expect(subdomain).toNotExist();
        });

        it('correctly returns a value for a valid subdomain', () => {
            let subdomain = getSubdomain('team.local.lunohq.com:3000');
            expect(subdomain).toBe('team');
            subdomain = getSubdomain('team.dev.lunohq.com');
            expect(subdomain).toBe('team');
            subdomain = getSubdomain('team.staging.lunohq.com');
            expect(subdomain).toBe('team');
            subdomain = getSubdomain('team.lunohq.com');
            expect(subdomain).toBe('team');
        });
    });
});

import { capitalize } from 'lodash';
import expect from 'expect';

import { getInitials } from '../../../src/common/components/ProfileAvatar';
import ProfileFactory from '../../factories/ProfileFactory';

describe('ProfileAvatar', () => {

    describe('getInitials', () => {

        it('returns the initials for the profile', () => {
            const profile = ProfileFactory.getProfile();
            const initials = getInitials(profile);
            expect(initials).toEqual(capitalize(profile.first_name[0]));
        });

        it('handles profiles without names', () => {
            /*eslint-disable camelcase*/
            const profile = ProfileFactory.getProfile({first_name: null, last_name: null});
            /*eslint-enable camelcase*/
            const initials = getInitials(profile);
            expect(initials).toEqual('');
        });

    });
});

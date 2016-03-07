import expect from 'expect';

import { getNextPath } from '../../../src/common/services/user';

describe('getNextPath', () => {

    it('returns null if we don\'t have a querystring', () => {
        const path = getNextPath({raw: '/login'});
        expect(path).toNotExist();
    });

    it('returns null if we don\'t have next in the querystring', () => {
        const path = getNextPath({raw: '/login?something=here&somethingelse=here'});
        expect(path).toNotExist();
    });

    it('returns the path if next is the only parameter', () => {
        const path = getNextPath({raw: '/login?next=%2Fprofile%2F1234'});
        expect(path).toEqual('/profile/1234');
    });

    it('returns the path if next is the last parameter', () => {
        const path = getNextPath({raw: '/login?something=here&next=%2Fprofile%2F1234'});
        expect(path).toEqual('/profile/1234');
    });

});

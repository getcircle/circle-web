import expect from 'expect';

import {
    detectURLsAndAddMarkup
} from '../../src/utils/string';

describe('string utils', () => {

    it('detects one URL and adds markup', () => {
        let url = 'Luno URL http://www.lunohq.com';
        expect(detectURLsAndAddMarkup(url)).toBe('Luno URL <a href="http://www.lunohq.com" target="_blank">http://www.lunohq.com</a>');

        url = 'Luno URL https://dev.lunohq.com';
        expect(detectURLsAndAddMarkup(url)).toBe('Luno URL <a href="https://dev.lunohq.com" target="_blank">https://dev.lunohq.com</a>');
    });

    it('detects multiple URLs and adds markup', () => {
        let url = 'Luno URLs http://www.lunohq.com https://team.lunohq.com';
        expect(detectURLsAndAddMarkup(url)).toBe(
            'Luno URLs <a href="http://www.lunohq.com" target="_blank">http://www.lunohq.com</a> ' +
            '<a href="https://team.lunohq.com" target="_blank">https://team.lunohq.com</a>'
        );
    });

    it('work when no URLs are present', () => {
        let url = 'Luno Content';
        expect(detectURLsAndAddMarkup(url)).toBe('Luno Content');
    });
});

import expect from 'expect';

import {
    detectEmailsAndAddMarkup,
    detectURLsAndAddMarkup
} from '../../../src/common/utils/string';

describe('string utils', () => {

    it('detects one URL and adds markup', () => {
        let contentWithOneURL = 'Luno URL http://www.lunohq.com';
        expect(detectURLsAndAddMarkup(contentWithOneURL)).toBe(
            'Luno URL <a href="http://www.lunohq.com" target="_blank">http://www.lunohq.com</a>'
        );

        contentWithOneURL = 'Luno URL https://dev.lunohq.com';
        expect(detectURLsAndAddMarkup(contentWithOneURL)).toBe(
            'Luno URL <a href="https://dev.lunohq.com" target="_blank">https://dev.lunohq.com</a>'
        );
    });

    it('detects multiple URLs and adds markup', () => {
        let contentWithMultipleURLs = 'Luno URLs http://www.lunohq.com https://team.lunohq.com';
        expect(detectURLsAndAddMarkup(contentWithMultipleURLs)).toBe(
            'Luno URLs <a href="http://www.lunohq.com" target="_blank">http://www.lunohq.com</a> ' +
            '<a href="https://team.lunohq.com" target="_blank">https://team.lunohq.com</a>'
        );
    });

    it('work when no URLs are present', () => {
        let content = 'Luno Content';
        expect(detectURLsAndAddMarkup(content)).toBe('Luno Content');
    });

    it('detects an email and adds markup', () => {
        let contentWithOneEmail = 'Luno Support support@lunohq.com';
        expect(detectEmailsAndAddMarkup(contentWithOneEmail)).toBe(
            'Luno Support <a href="mailto:support@lunohq.com">support@lunohq.com</a>'
        );

        contentWithOneEmail = 'Luno Old Support support@circlehq.co';
        expect(detectEmailsAndAddMarkup(contentWithOneEmail)).toBe(
            'Luno Old Support <a href="mailto:support@circlehq.co">support@circlehq.co</a>'
        );
    });


    it('detects multiple emails and adds markup', () => {
        let contentWithMultipleEmails = 'Luno Support - support@lunohq.com \n Luno Sales - sales@lunohq.com';
        expect(detectEmailsAndAddMarkup(contentWithMultipleEmails)).toBe(
            'Luno Support - <a href="mailto:support@lunohq.com">support@lunohq.com</a>' +
            ' \n Luno Sales - <a href="mailto:sales@lunohq.com">sales@lunohq.com</a>'
        );
    });

});

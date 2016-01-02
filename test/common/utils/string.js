import expect from 'expect';

import {
    detectLineBreaksAndAddMarkup,
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
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

    it('does not include line breaks in URL', () => {
        let contentWithMultipleURLs = '<div>Luno URL<br><br>https://github.com/getcircle/stacks/blob/master/conf/lunohq/staging.env<br>Hello</div><pre>abc</pre>';
        expect(detectURLsAndAddMarkup(contentWithMultipleURLs)).toBe(
            '<div>Luno URL<br><br><a href="https://github.com/getcircle/stacks/blob/master/conf/lunohq/staging.env" target="_blank">https://github.com/getcircle/stacks/blob/master/conf/lunohq/staging.env</a><br>Hello</div><pre>abc</pre>'
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

    it('detects hash tags and replaces with search URLs', () => {
        let content = 'This post answers all my questions #GoLuno';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno</a>'
        );
    });

    it('detects hash tags when they end with a line break', () => {
        let content = 'This post answers all my questions #GoLuno\n';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno</a>\n'
        );
    });

    it('detects multiple hash tags with a space', () => {
        let content = 'This post answers all my questions #GoLuno #Awesome';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno</a> <a class="hashtag">#Awesome</a>'
        );
    });

    it('detects hash tags only when they are letters numbers or underscores', () => {
        let content = 'This post answers all my questions #GoLuno-That';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno</a>-That'
        );
    });

    it('detects hash tags with underscores', () => {
        let content = 'This post answers all my questions #GoLuno_That';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno_That</a>'
        );
    });

    it('does not detect multiple hash tags without a space', () => {
        let content = 'This post answers all my questions #GoLuno#Awesome';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions <a class="hashtag">#GoLuno</a>#Awesome'
        );
    });

    it('does not detect hash tags as part of URLs', () => {
        let content = 'This post answers all my questions https://lunohq.com/search/#meeting';
        expect(detectHashtagsAndAddMarkup(content)).toBe(
            'This post answers all my questions https://lunohq.com/search/#meeting'
        );
    });


    it('does detects text line breaks and adds line break HTML tags', () => {
        let content = 'Test of\ntext line\n\n\nbreaks with \n or without spaces.\n';
        expect(detectLineBreaksAndAddMarkup(content)).toBe(
            'Test of<br>text line<br><br><br>breaks with <br> or without spaces.<br>'
        );
    });
});

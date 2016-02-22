import expect from 'expect'

import Post, { Content, Header, Footer } from '../../../src/common/components/PostV2';

const setup = buildSetup(Post, () => {
    return {
        post: factories.post.getPost(),
    };
});

describe('Post', () => {

    it('renders the sections of the post', () => {
        const { wrapper, props } = setup();
        const content = wrapper.find(Content);
        const header = wrapper.find(Header);
        const footer = wrapper.find(Footer);
        expect(header.length).toEqual(1);
        expect(header.prop('post')).toEqual(props.post);
        expect(content.length).toEqual(1);
        expect(content.prop('post')).toEqual(props.post);
        expect(footer.length).toEqual(1);
        expect(footer.prop('post')).toEqual(props.post);
    });

});

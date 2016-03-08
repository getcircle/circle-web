import expect from 'expect'

import Post, { Author, OptionsMenu, Content, Header, Footer } from '../../../src/common/components/PostV2';

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

    describe('OptionsMenu', () => {
        it('is always rendered', () => {
            const { wrapper } = setup(undefined, Header);
            expect(wrapper.find(OptionsMenu).length).toEqual(1);
        });

        it('includes edit and delete options when author', () => {
            const post = factories.post.getPost();
            const { wrapper } = setup({post}, OptionsMenu, {auth: {profile: post.by_profile}});
            expect(wrapper.children().length).toEqual(3);
        });

        it('only includes copy when not the author', () => {
            const { wrapper } = setup(undefined, OptionsMenu);
            expect(wrapper.children().length).toEqual(1);
        });

    });

});

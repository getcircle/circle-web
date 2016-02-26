import Immutable from 'immutable';
import expect from 'expect';
import normalize from 'protobuf-normalizr';
import faker from 'faker';
import { services } from 'protobufs'

import createStore from '../../../src/common/createStore';
import { createPost, updatePost } from '../../../src/common/actions/posts';
import { PostEditor, selector } from '../../../src/common/containers/PostEditorV2';
import { default as PostEditorComponent } from '../../../src/common/components/PostEditorV2';
// test to ensure we redirect to view post if not the author
//

const { PostStateV1 } = services.post.containers;

const store = createStore();
const state = store.getState();

const setup = buildSetup(PostEditor, () => {
    return {
        dispatch: expect.createSpy(),
    };
});

function getNormalizedPost(post = factories.post.getPost()) {
    const copy = post.$type.decode(post.encode());
    return Immutable.fromJS(normalize(copy, post.id));
};

describe('PostEditor', () => {

    it('uses an existing post if an id is present in the url', () => {
        const post = factories.post.getPost();
        const cache = getNormalizedPost(post);
        const newState = state.set('cache', cache).updateIn(['post', 'ids'], set => set.add(post.id));
        const props = selector(newState, {params: {postId: post.id}});
        expect(props.post).toEqual(post);
    });

    it('generates a new post object without an id if we don\'t have a post id', () => {
        const props = selector(state, {params: {}});
        expect(props.post.id).toNotExist();
    });

    describe('editing a post', () => {

        describe('autoSave', () => {

            it('isn\'t enabled if the post is live', () => {
                const { wrapper } = setup({
                    post: factories.post.getPost({state: PostStateV1.LISTED}),
                });
                expect(wrapper.find(PostEditorComponent).prop('autoSave')).toNotExist();
            });

            it('is enabled if the post is in draft mode', () => {
                const { wrapper } = setup({
                    post: factories.post.getPost({state: PostStateV1.DRAFT}),
                });
                expect(wrapper.find(PostEditorComponent).prop('autoSave')).toExist();
            });

        });
    });

    describe('saving a post', () => {

        it('fires an updatePost action if the post exists', () => {
            const { wrapper, props } = setup({post: factories.post.getPost()}, undefined, {store: store});
            wrapper.find(PostEditorComponent).prop('onSave')(props.post);
            expect(props.dispatch).toHaveBeenCalledWith(updatePost(props.post));
        });

        it('fires a createPost action if the post doesn\'t exist', () => {
            const { wrapper, props } = setup({post: factories.post.getPost({id: null})});
            wrapper.find(PostEditorComponent).prop('onSave')(props.post);
            expect(props.dispatch).toHaveBeenCalledWith(createPost(props.post));
        });

    });

});

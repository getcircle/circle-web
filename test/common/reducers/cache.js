import expect from 'expect.js';
import Immutable from 'immutable';
import faker from 'faker';

import cache from '../../../src/common/reducers/cache';

function mockPayloadWithPost(postId = faker.random.uuid(), postFields = {}) {
    const posts = {};
    posts[postId] = postFields;
    return {
        normalizations: {
            '.services.post.containers.postv1': posts,
        },
        entities: {},
    };
}

describe('cache reducer', () => {

    it('replaces normalizations for objects already in cache instead of merging them', () => {
        const postId = faker.random.uuid();
        const fileId = faker.random.uuid();
        const initialState = Immutable.fromJS(mockPayloadWithPost(
            postId,
            {
                'by_profile_id': faker.random.uuid(),
                'files': [fileId, faker.random.uuid(), faker.random.uuid()],
            }
        ));
        const state = cache(
            initialState,
            {
                payload: mockPayloadWithPost(
                    postId,
                    {
                        'files': [fileId],
                    }
                )
            }
        );
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(postId).has('by_profile_id')).to.not.be.ok();
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(postId).get('files').size).to.be(1);
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(postId).get('files').get(0)).to.be(fileId);
    });

    it('keeps existing normalizations after adding in new ones', () => {
        const existingPostId = faker.random.uuid();
        const newPostId = faker.random.uuid();
        const initialState = Immutable.fromJS(mockPayloadWithPost(
            existingPostId,
            {
                'by_profile_id': faker.random.uuid()
            }
        ));
        const state = cache(
            initialState,
            {
                payload: mockPayloadWithPost(
                    newPostId,
                    {
                        'by_profile_id': faker.random.uuid()
                    }
                )
            }
        );
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(existingPostId).has('by_profile_id')).to.be.ok();
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(newPostId).has('by_profile_id')).to.be.ok();
    });

});

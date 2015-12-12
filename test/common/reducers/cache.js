import expect from 'expect.js';
import Immutable from 'immutable';
import faker from 'faker';

import cache from '../../../src/common/reducers/cache';

function mockPayloadWithPost(postId = faker.random.uuid(), postFields = Immutable.Map()) {
    const posts = {};
    posts[postId] = Immutable.Map(postFields);
    return {
        normalizations: Immutable.Map({
            '.services.post.containers.postv1': Immutable.Map(posts)
        }),
        entities: Immutable.Map()
    };
}

describe('cache reducer', () => {

    it('replaces normalizations for objects already in cache instead of merging them', () => {
        const postId = faker.random.uuid();
        const initialState = Immutable.Map(mockPayloadWithPost(
            postId,
            {
                'by_profile_id': faker.random.uuid()
            }
        ));
        const state = cache(
            initialState,
            {
                payload: mockPayloadWithPost(postId)
            }
        );
        expect(state.get('normalizations').get('.services.post.containers.postv1').get(postId).has('by_profile_id')).to.not.be.ok();
    });

    it('keeps existing normalizations after adding in new ones', () => {
        const existingPostId = faker.random.uuid();
        const newPostId = faker.random.uuid();
        const initialState = Immutable.Map(mockPayloadWithPost(
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

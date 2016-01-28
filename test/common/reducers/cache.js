import expect from 'expect.js';
import Immutable from 'immutable';
import faker from 'faker';
import { services } from 'protobufs';

import cache from '../../../src/common/reducers/cache';

import PostFactory from '../../factories/PostFactory';

function mockPayloadWithPost(postId = faker.random.uuid(), normalizationFields = {}, entityFields = {}) {
    const normalizations = {};
    normalizations[postId] = normalizationFields;
    const entities = {};
    entities[postId] = entityFields;
    return {
        normalizations: {
            '.services.post.containers.postv1': normalizations,
        },
        entities: {
            '.services.post.containers.postv1': entities,
        },
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

    it('timestamps entities when they are cached', () => {
        const postId = faker.random.uuid();
        const initialState = Immutable.fromJS({
            timestamps: {},
        });
        const state = cache(
            initialState,
            {
                payload: mockPayloadWithPost(postId)
            }
        );
        expect(state.get('timestamps').get('.services.post.containers.postv1').has(postId)).to.be.ok();
    });

    it('preserves values in the cache if they weren\'t requested in the new entity', () => {
        const initialPost = PostFactory.getPost();
        const initialPayload = mockPayloadWithPost(initialPost.id, undefined, initialPost);
        const initialState = Immutable.fromJS(initialPayload);
        const nextPost = PostFactory.getPost({
            id: initialPost.id,
            content: null,
            snippet: faker.lorem.sentence(),
            /*eslint-disable camelcase */
            by_profile: null,
            /*eslint-enable camelcase */
            changed: null,
            fields: new services.common.containers.FieldsV1({only: ['snippet']}),
        });
        const nextPayload = mockPayloadWithPost(nextPost.id, undefined, nextPost);
        const state = cache(initialState, {payload: nextPayload});
        const cached = state.getIn(['entities', '.services.post.containers.postv1', nextPost.id]);
        expect(cached.snippet).to.equal(nextPost.snippet);
        expect(cached.content).to.equal(initialPost.content);
        expect(cached.title).to.equal(initialPost.title);
    });

});

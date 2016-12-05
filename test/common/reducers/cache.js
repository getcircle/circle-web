import expect from 'expect.js';
import Immutable from 'immutable';
import faker from 'faker';
import { services } from 'protobufs';

import cache, { mergeEntities } from '../../../src/common/reducers/cache';

import PostFactory from '../../factories/PostFactory';
import ProfileFactory from '../../factories/ProfileFactory';
import TeamFactory from '../../factories/TeamFactory';

const { RoleV1 } = services.team.containers.TeamMemberV1;

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

    describe('mergeEntities', () => {
        it('only merges fields from old entity if new entity doesn\'t have them', () => {
            const profile = ProfileFactory.getProfile();
            const newEntity = TeamFactory.getTeamMember(
                RoleV1.COORDINATOR,
                profile,
                {inflations: new services.common.containers.InflationsV1({only: ['profile']})},
            );
            newEntity.team = null;
            const oldEntity = TeamFactory.getTeamMember(undefined, profile);
            mergeEntities(newEntity, oldEntity);
            expect(newEntity.role).to.equal(RoleV1.COORDINATOR);
            expect(newEntity.team).to.equal(oldEntity.team);
        });

        it('merges fields from old entity if new entity doesn\'t have them', () => {
            const profile = ProfileFactory.getProfile();
            const newEntity = TeamFactory.getTeamMember(
                RoleV1.COORDINATOR,
                profile,
                {inflations: new services.common.containers.InflationsV1({exclude: ['profile']})},
            );
            newEntity.profile = null;
            const oldEntity = TeamFactory.getTeamMember(undefined, profile);
            mergeEntities(newEntity, oldEntity);
            expect(newEntity.role).to.equal(RoleV1.COORDINATOR);
            expect(newEntity.profile).to.equal(oldEntity.profile);
        });
    });

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

    it('preserves normalizations in the cache if they weren\'t requested in the new entity', () => {
        const teamMember = new services.team.containers.TeamMemberV1({
            id: faker.random.uuid(),
            role: 1,
            /*eslint-disable camelcase*/
            profile_id: faker.random.uuid(),
            /*eslint-enable camelcase*/
        });
        const team = new services.team.containers.TeamV1({
            id: faker.random.uuid(),
            name: faker.hacker.noun(),
            /*eslint-disable camelcase*/
            total_members: 4,
            /*eslint-enable camelcase*/
        });

        const profile = ProfileFactory.getProfile();

        // simulate state we get from fetching team member and inflating team
        const initialState = Immutable.fromJS({
            entities: {
                '.services.team.containers.teammemberv1': {
                    [teamMember.id]: teamMember,
                },
                '.services.team.containers.teamv1': {
                    [team.id]: team,
                },
            },
            normalizations: {
                '.services.team.containers.teammemberv1': {
                    [teamMember.id]: {team: team.id},
                },
            },
        });

        // simulate payload we get from fetching team member without inflating team
        const payload = {
            entities: {
                '.services.team.containers.teammemberv1': {
                    [teamMember.id]: new services.team.containers.TeamMemberV1({
                        id: teamMember.id,
                        inflations: new services.common.containers.InflationsV1({exclude: ['team']}),
                        role: 1,
                        profile: null,
                        /*eslint-disable camelcase*/
                        profile_id: profile.id,
                        /*eslint-enable camelcase*/
                        team: null,
                    }),
                },
                '.services.profile.containers.profilev1': {
                    [profile.id]: profile,
                },
            },
            normalizations: {
                '.services.team.containers.teammemberv1': {
                    [teamMember.id]: {profile: profile.id},
                },
            },
        };

        const state = cache(initialState, { payload });
        const memberNormalizations = state.getIn([
            'normalizations',
            '.services.team.containers.teammemberv1',
            teamMember.id,
        ]).toJS();
        expect(Object.keys(memberNormalizations).length).to.equal(2);
        expect(memberNormalizations.profile).to.equal(profile.id);
        expect(memberNormalizations.team).to.equal(team.id);
    });

});

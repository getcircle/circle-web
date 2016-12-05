import expect from 'expect';

import { missingCollections } from '../../../src/common/components/AddToCollectionMenu';

describe('missingCollections', () => {

    it('handles the second collection set being empty', () => {
        const newCollections = factories.post.getCollections(2);
        const added = missingCollections(newCollections, undefined);
        expect(added).toEqual(newCollections);
    });

    it('handles the first collection set being empty', () => {
        const oldCollections = factories.post.getCollections(2);
        const added = missingCollections(undefined, oldCollections);
        expect(added).toEqual([]);
    });

    it('returns collections from the first set that aren\'t within the second set', () => {
        const newCollections = [factories.post.getCollection({id: '1'}), factories.post.getCollection({id: '2'})];
        const oldCollections = [factories.post.getCollection({id: '1'}), factories.post.getCollection({id: '3'})];
        const added = missingCollections(newCollections, oldCollections);
        expect(added.length).toEqual(1);
        expect(added[0].id).toEqual('2');
    });

});

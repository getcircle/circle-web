import { includes } from 'lodash';
import Immutable from 'immutable';

import { retrieveCollections } from './denormalizations';
import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    collections: [],
    filteredCollections: [],
});

export default function (state = initialState, action) {
    let collections;
    switch(action.type) {
    case types.GET_EDITABLE_COLLECTIONS_SUCCESS:
        const ids = getCollectionsNormalizations(
            action.payload.result,
            action.payload,
        )
        collections = retrieveCollections(ids, action.payload);
        return state.update('collections', list => list.push(...collections));
    case types.FILTER_COLLECTIONS:
        const query = action.payload;
        collections = state.get('collections');
        const results = collections.filter((collection) => {
            for (let part of query.split(' ')) {
                part = part.trim()
                if (part !== '' && includes(collection.name.toLowerCase(), part)) {
                    return true;
                }
            }
            return false;
        });
        return state.set('filteredCollections', results);
    case types.CLEAR_COLLECTIONS_FILTER:
        return state.set('filteredCollections', Immutable.List());
    }
    return state;
}

import { includes } from 'lodash';
import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    availableCollections: [],
    filteredCollections: [],
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.FILTER_COLLECTIONS:
        const availableCollections = state.get('availableCollections');
        const query = action.payload;
        const results = availableCollections.filter((collection) => {
            for (let part of query.split(' ')) {
                part = part.trim()
                if (part !== '' && includes(collection.name.toLowerCase(), part)) {
                    return true;
                }
            }
            return false;
        });
        return state.withMutations((map) => {
            return map.set('filteredCollections', results)
                .set('availableCollections', availableCollections);
            });
    case types.CLEAR_COLLECTIONS_FILTER:
        return state.set('filteredCollections', Immutable.List());
    case types.INITIALIZE_COLLECTIONS_FILTER:
        return state.set('availableCollections', Immutable.fromJS(action.payload));
    }
    return state;
}

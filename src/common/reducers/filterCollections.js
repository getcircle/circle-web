import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    availableCollections: [],
    filteredCollections: [],
});

function getDisplayName(collection) {
    const name = collection.display_name.replace(/\[|\]/g, '') || '';
    return name.toLowerCase();
}

export default function (state = initialState, action) {
    switch(action.type) {
    case types.FILTER_COLLECTIONS:
        const availableCollections = state.get('availableCollections');
        const query = action.payload;
        let results = availableCollections.filter((collection) => {
            const name = getDisplayName(collection);
            for (let part of query.split(' ')) {
                part = part.trim()
                if (part !== '' && name.includes(part.toLowerCase())) {
                    return true;
                }
            }
            return false;
        }).toJS();

        const startsWith = [];
        const endsWith = [];
        for (let index in results) {
            const result = results[index];
            const name = getDisplayName(result);
            if (name.startsWith(action.payload)) {
                startsWith.push(results.splice(index, 1)[0]);
            } else if (name.endsWith(action.payload)) {
                endsWith.push(results.splice(index, 1)[0]);
            }
        }

        results = startsWith.concat(endsWith, results);
        return state.withMutations((map) => {
            return map.set('filteredCollections', Immutable.fromJS(results))
                .set('availableCollections', availableCollections);
            });
    case types.CLEAR_COLLECTIONS_FILTER:
        return state.set('filteredCollections', Immutable.List());
    case types.INITIALIZE_COLLECTIONS_FILTER:
        return state.set('availableCollections', Immutable.fromJS(action.payload));
    }
    return state;
}

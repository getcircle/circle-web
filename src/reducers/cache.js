import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    entities: Immutable.Map(),
    normalizations: Immutable.Map(),
});

export default function cache(state = initialState, action) {
    if (action.payload && action.payload.entities) {
        return state.withMutations(map => {
            return map.mergeDeepIn(['entities'], action.payload.entities)
                .mergeDeepIn(['normalizations'], action.payload.normalizations);
        });
    }
    return state;
}

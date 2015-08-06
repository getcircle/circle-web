import { search } from '../services/search';

const searchSource = (alt) => {
    return {

        search: {

            remote(state, query, category) {
                return search(query, category);
            },

            loading: alt.actions.SearchActions.loading,
            success: alt.actions.SearchActions.searchSuccess,
            error: alt.actions.SearchActions.searchError,
        }

    };

};

export default searchSource;

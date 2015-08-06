import searchSource from '../sources/searchSource';

class SearchStore {

    constructor() {
        this.registerAsync(searchSource);
        this.bindActions(this.alt.getActions('SearchActions'));

        // XXX should have this be {'query': [results]} so we can take advantage of local caching
        this.results = [];
        this.active = false;
    }

    onSearchSuccess(state) {
        state.active = true;
        this.setState(state);
    }

    onClearResults(state) {
        this.setState({
            results: [],
            active: false,
        });
    }

}

export default SearchStore;

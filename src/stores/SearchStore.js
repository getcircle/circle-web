'use strict';

import searchSource from '../sources/searchSource';

class SearchStore {

    constructor() {
        this.registerAsync(searchSource);
        this.bindActions(this.alt.getActions('SearchActions'));

        this.results = [];
    }

    onSearchSuccess(state) {
        this.setState(state);
    }

    onClearResults(state) {
        this.setState({results: []});
    }

}

export default SearchStore;

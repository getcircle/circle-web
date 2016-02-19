import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { createSelector } from 'reselect';
import { provideHooks } from 'redial';

import { clearSearchResults, search } from '../actions/search';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import SearchDetail from '../components/SearchDetail';

const selector = createSelector(
    [
        selectors.searchSelector,
    ],
    (searchState) => {
        return {
            loading: searchState.get('loading'),
            // TODO we should support immutable here
            results: searchState.get('results').toJS(),
        }
    },
);

function fetchSearchResults({dispatch, params: { query }}) {
    return dispatch(search(query));
}

const hooks = {
    defer: (locals) => fetchSearchResults(locals),
};

class Search extends CSSComponent {

    static propTypes = {
        loading: PropTypes.bool,
        params: PropTypes.object.isRequired,
        results: PropTypes.object,
    }

    handleLoadMore = () => {
    }

    handleSelectResult = () => {
        // TODO track search result
        // TODO ensure we have access to the index of the result that was clicked
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.query !== this.props.params.query) {
            this.props.dispatch(clearSearchResults());
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearSearchResults());
    }

    render() {
        const { loading, params: { query } } = this.props;
        const title = t(`Search \u2013 ${query}`);

        let content;
        if (loading) {
            content = <CenterLoadingIndicator />;
        } else {
            const queryResults = this.props.results[query] || [];
            content = (
                <SearchDetail
                    hasMore={false}
                    onLoadMore={this.handleLoadMore}
                    onSelectResult={this.handleSelectResult}
                    query={query}
                    results={queryResults}
                    totalResults={queryResults.length}
                />
            );
        }

        return (
            <Container title={title}>
                {content}
            </Container>
        );
    }

}

export { Search };
export default provideHooks(hooks)(connect(selector)(Search));

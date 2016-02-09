import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { createSelector } from 'reselect';

import { clearSearchResults, loadSearchResults } from '../actions/search';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';
import t from '../utils/gettext';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DocumentTitle from '../components/DocumentTitle';
import SearchResults from '../components/SearchResults';

const selector = createSelector(
    [
        selectors.searchSelector,
    ],
    (searchState) => {
        return {
            results: searchState.get('results').toJS(),
        }
    },
);

function fetchSearchResults(dispatch, query) {
    return dispatch(loadSearchResults(query));
}

function fetchData(getState, dispatch, location, params) {
    const promises = [];
    promises.push(fetchSearchResults(dispatch, params.query));
    return Promise.all(promises);
}

@connectData(fetchData)
@connect(selector)
class SearchV2 extends CSSComponent {

    static propTypes = {
        params: PropTypes.object.isRequired,
        results: PropTypes.object.isRequired,
    }

    classes() {
        return {
            default: {
                resultsContainer: {
                    width: '100%',
                },
                titleSection: {
                    height: 200,
                },
                titleText: {
                    fontSize: '24px',
                },
            }
        }
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
        const { params: { query } } = this.props;
        const title = t(`Search \u2013 ${query}`);
        const queryResults = this.props.results[query] || [];
        return (
            <Container>
                <DocumentTitle title={title}>
                    <section className="wrap">
                        <section className="row middle-xs" style={this.styles().titleSection}>
                            { /* TODO handle Results vs Result if only 1 */ }
                            <h1 style={this.styles().titleText}>{t(`${queryResults.length} Results for "${query}"`)}</h1>
                        </section>
                        <section className="row">
                            <div style={this.styles().resultsContainer}>
                                <SearchResults results={this.props.results[query]} />
                            </div>
                        </section>
                    </section>
                </DocumentTitle>
            </Container>
        );
    }

}

export default SearchV2;

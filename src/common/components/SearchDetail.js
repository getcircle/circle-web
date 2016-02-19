import React, { PropTypes } from 'react';

import Colors from '../styles/Colors';
import t from '../utils/gettext';

import DetailContent from './DetailContent';
import DetailSection from './DetailSectionV2';
import SearchResults from './SearchResults';

export const SearchDetailHeader = ({ totalResults, query }) => {
    const resultsKeyword = totalResults === 1 ? 'Result' : 'Results';
    const title = t(`${totalResults} ${resultsKeyword} for "${query}"`);
    return (
        <section>
            <span style={{fontSize: '1.3rem', color: Colors.extraLightBlack}}>{title}</span>
        </section>
    );
};

const SearchDetail = (props) => {
    const { query, totalResults, ...other } = props;
    return (
        <DetailContent>
            <SearchDetailHeader query={query} totalResults={totalResults} />
            <section className="row">
                <section className="col-xs-3">
                </section>
                <section className="col-xs-8 col-xs-offset-1">
                    <DetailSection dividerStyle={{marginBottom: 0}}>
                        <SearchResults {...other} />
                    </DetailSection>
                </section>
            </section>
        </DetailContent>
    );
};

SearchDetail.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onSelectResult: PropTypes.func,
    query: PropTypes.string.isRequired,
    results: PropTypes.array,
    totalResults: PropTypes.number.isRequired,
};

export default SearchDetail;

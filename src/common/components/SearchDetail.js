import React, { PropTypes } from 'react';

import Colors from '../styles/Colors';
import { showRequestMissingInfoModal } from '../actions/search';
import t from '../utils/gettext';

import DetailContent from './DetailContent';
import DetailQuestionSection from './DetailQuestionSection';
import DetailSection from './DetailSectionV2';
import RequestMissingInfoForm from './RequestMissingInfoForm';
import SearchResultsList from './SearchResultsList';

export const SearchDetailHeader = ({ totalResults, query }) => {
    const resultsKeyword = totalResults === 1 ? 'Result' : 'Results';
    const title = t(`${totalResults} ${resultsKeyword} for "${query}"`);
    return (
        <section>
            <span style={{fontSize: '1.3rem', color: Colors.extraLightBlack}}>{title}</span>
        </section>
    );
};

const SearchDetailMissingInfo = ({ query, ...other}, { store }) => {
    const onRequestMissingInfo = () => {
        store.dispatch(showRequestMissingInfoModal());
    };

    return (
        <div>
            <DetailQuestionSection
                buttonText={t('Request Missing Info')}
                onTouchTap={onRequestMissingInfo}
                questionText={t('Didn\'t find what you were looking for?')}
            />
            <RequestMissingInfoForm query={query} />
        </div>
    );
};

SearchDetailMissingInfo.contextTypes = {
    store: PropTypes.shape({
         dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const SearchDetail = (props) => {
    const {
        hasMore,
        loading,
        onLoadMore,
        onSelectResult,
        query,
        results,
        totalResults,
        ...other
    } = props;
    return (
        <DetailContent>
            <SearchDetailHeader query={query} totalResults={totalResults} />
            <section className="row">
                <section className="col-xs-3">
                    <SearchDetailMissingInfo query={query} />
                </section>
                <section className="col-xs-8 col-xs-offset-1">
                    <DetailSection dividerStyle={{marginBottom: 0}}>
                        <SearchResultsList
                            hasMore={hasMore}
                            loading={loading}
                            onLoadMore={onLoadMore}
                            onSelectItem={onSelectResult}
                            results={results}
                        />
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

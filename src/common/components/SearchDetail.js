import React, { PropTypes } from 'react';

import Colors from '../styles/Colors';
import FontWeights from '../styles/FontWeights';
import t from '../utils/gettext';

import DetailContent from './DetailContent';
import DetailSection from './DetailSectionV2';
import RoundedButton from './RoundedButton';
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

const SearchDetailMissingInfo = () => {
    const styles = {
        text: {
            fontSize: '1.8rem',
            color: Colors.lightBlack,
            lineHeight: '2.8rem',
        },
        button: {
            marginTop: 10,
            lineHeight: '2.8rem',
        },
        label: {
            fontSize: '0.9rem',
            fontWeight: FontWeights.black,
        },
    };
    return (
        <DetailSection>
            <div style={styles.text}>{t('Didn\'t find what you were looking for?')}</div>
            <RoundedButton
                label={t('Request Missing Info')}
                labelStyle={styles.label}
                style={styles.button}
            />
        </DetailSection>
    );
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
                    <SearchDetailMissingInfo />
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
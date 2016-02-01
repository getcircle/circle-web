import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../selectors';

import CSSComponent from '../CSSComponent';

import * as itemFactory from './factories';
import Core from './Core';
import ResultsSection from './ResultsSection';
import Section from './Section';

const selector = selectors.createImmutableSelector(
    [
        selectors.searchSelector,
    ],
    (
        searchState
    ) => {
        return {
            results: searchState.get('results').toJS(),
        };
    }
);

class QuickSearch extends CSSComponent {

    static propTypes = {
        defaults: PropTypes.arrayOf(PropTypes.instanceOf(Section)),
        results: PropTypes.object,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        defaults: [],
        results: {},
    }

    state = {
        query: '',
    }

    getTriggerAndResults() {
        const { query } = this.state;
        const { history } = this.context;
        const trigger = itemFactory.getSearchTrigger(query, 0, history);
        const querySpecificResults = this.props.results[query];
        return [
            new Section([trigger], undefined, 0),
            new ResultsSection(querySpecificResults, history),
        ];
    }

    getSections() {
        if (this.state.query === '') {
            return this.props.defaults;
        } else {
            return this.getTriggerAndResults();
        }
    }

    handleChange(value) {
        this.setState({query: value});
    }

    render() {
        const {
            defaults,
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Core
                onChange={::this.handleChange}
                sections={sections}
                {...other}
            />
        );
    }
}

export { QuickSearch };
export default connect(selector)(QuickSearch);

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';

import CSSComponent from './CSSComponent';

import Search from './Search';
import ResultsSection from './Search/ResultsSection';
import Section from './Search/Section';
import * as itemFactory from './Search/factories';

const selector = selectors.createImmutableSelector(
    [
        selectors.autocompleteSelector,
    ],
    (
        autocompleteState
    ) => {
        return {
            // TODO we should support Immutable.js in the search results
            results: autocompleteState.get('results').toJS(),
        };
    }
);

class AutoComplete extends CSSComponent {

    static propTypes = {
        defaults: PropTypes.arrayOf(PropTypes.instanceOf(Section)),
        onBlur: PropTypes.func,
        results: PropTypes.object,
    }

    static defaultProps = {
        defaults: [],
        onBlur: () => {},
        results: {},
    }

    state = {
        query: '',
    }

    handleChange = (value) => {
        this.setState({query: value});
    }

    handleBlur = () => {
        this.setState({query: ''});
        this.props.onBlur();
    }

    getTriggerAndResults() {
        const { query } = this.state;
        const trigger = itemFactory.getSearchTrigger(query, 0);
        const querySpecificResults = this.props.results[query];
        return [
            new Section([trigger], undefined, 0),
            new ResultsSection(querySpecificResults),
        ];
    }

    getSections() {
        if (this.state.query === '') {
            return this.props.defaults;
        } else {
            return this.getTriggerAndResults();
        }
    }

    render() {
        const {
            defaults,
            onBlur,
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Search
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                sections={sections}
                {...other}
            />
        );
    }
}

export { AutoComplete };
export default connect(selector)(AutoComplete);

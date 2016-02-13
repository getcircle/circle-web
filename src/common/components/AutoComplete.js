import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { clearResults, autocomplete } from '../actions/autocomplete';
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
        dispatch: PropTypes.func.isRequired,
        results: PropTypes.object,
    }

    static defaultProps = {
        defaults: [],
        results: {},
    }

    state = {
        query: '',
    }

    handleChange = (value) => {
        this.setState({query: value});
    }

    handleDelayedChange = (value) => {
        this.props.dispatch(autocomplete(inputValue));
    }

    handleBlur = () => {
        this.setState({query: ''});
        this.props.dispatch(clearResults());
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
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Search
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onDelayedChange={this.handleDelayedChange}
                sections={sections}
                {...other}
            />
        );
    }
}

export { AutoComplete };
export default connect(selector)(AutoComplete);

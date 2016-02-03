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

class QuickSearch extends CSSComponent {

    static propTypes = {
        defaults: PropTypes.arrayOf(PropTypes.instanceOf(Section)),
        onBlur: PropTypes.func,
        results: PropTypes.object,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
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

    render() {
        const {
            defaults,
            onBlur,
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Core
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                sections={sections}
                {...other}
            />
        );
    }
}

export { QuickSearch };
export default connect(selector)(QuickSearch);

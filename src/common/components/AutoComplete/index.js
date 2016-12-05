import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { clearResults, autocomplete } from '../../actions/autocomplete';
import * as selectors from '../../selectors';
import * as routes from '../../utils/routes';
import { SEARCH_LOCATION, SEARCH_RESULT_SOURCE } from '../../constants/trackerProperties';
import tracker from '../../utils/tracker';

import CSSComponent from '../CSSComponent';
import Search from '../Search';
import Section from '../Search/Section';

import * as factories from './factories';

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

function createResult(result) {
    let searchResult = null;
    if (result.profile) {
        searchResult = factories.createProfileResult(result)
    } else if (result.team) {
        searchResult = factories.createTeamResult(result);
    } else if (result.post) {
        searchResult = factories.createPostResult(result);
    } else if (result.collection) {
        searchResult = factories.createCollectionResult(result);
    }
    return searchResult;
}

class AutoComplete extends CSSComponent {

    static propTypes = {
        defaults: PropTypes.arrayOf(PropTypes.instanceOf(Section)),
        dispatch: PropTypes.func.isRequired,
        inputClassName: PropTypes.string,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
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

    handleDelayedChange = (value) => {
        this.props.dispatch(autocomplete(value));
    }

    handleBlur = (event) => {
        this.props.onBlur(event, this.state.query);
        this.setState({query: ''});
        this.props.dispatch(clearResults());
    }

    handleSelectItem = ({ type, payload }, event, index) => {
        tracker.trackSearchResultTap(
            this.state.query,
            SEARCH_RESULT_SOURCE.SUGGESTION,
            type,
            parseInt(index, 10) + 1,
            SEARCH_LOCATION.AUTOCOMPLETE,
            payload.id,
        );
        switch (type) {
        case factories.TYPES.TRIGGER:
            return routes.routeToSearch(payload);
        case factories.TYPES.PROFILE:
            return routes.routeToProfile(payload);
        case factories.TYPES.TEAM:
            return routes.routeToTeam(payload);
        case factories.TYPES.POST:
            return routes.routeToPost(payload);
        case factories.TYPES.COLLECTION:
            return routes.routeToCollection(payload);
        }
    }

    getTriggerAndResults() {
        const { query } = this.state;
        const trigger = factories.createSearchTrigger(query);
        const querySpecificResults = this.props.results[query];
        return [
            new Section([trigger], undefined, 0),
            new Section(querySpecificResults, undefined, undefined, createResult),
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
            onFocus,
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Search
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onDelayedChange={this.handleDelayedChange}
                onFocus={onFocus}
                onSelectItem={this.handleSelectItem}
                sections={sections}
                {...other}
            />
        );
    }
}

export { AutoComplete };
export default connect(selector)(AutoComplete);

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { services } from 'protobufs';

import * as selectors from '../selectors';

import { clearResults, search } from '../actions/search';

import Search from './Search';
import Section from './Search/Section';

const category = services.search.containers.search.CategoryV1.PROFILES;

const selector = selectors.createImmutableSelector(
    [
        selectors.searchSelector,
    ],
    (searchSelector) => {
        return {
            results: searchSelector.get('results').toJS(),
        };
    },
);

class AutoCompleteProfile extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        focused: PropTypes.bool,
        ignoreProfileIds: PropTypes.arrayOf(PropTypes.string),
        onBlur: PropTypes.func,
        onSelectProfile: PropTypes.func.isRequired,
        resultFactoryFunction: PropTypes.func.isRequired,
        results: PropTypes.object,
    }

    static defaultProps = {
        focued: false,
        ignoreProfileIds: [],
        onBlur: () => {},
    }

    state = {
        query: '',
    }

    shouldComponentUpdate(nextProps, nextState) {
        // If the props haven't changed, we don't want to update the component.
        // Since we focus the Search input if `focused` is true, we can run
        // into an issue where it keeps focusing even if it hasn't lost focus.
        // This causes an issue when using this as a form field.
        const hasChanged = (
            nextProps.ignoreProfileIds !== this.props.ignoreProfileIds ||
            nextProps.results !== this.props.results ||
            nextState.query !== this.state.query ||
            nextProps.focused !== this.props.focused
        );
        return !!hasChanged;
    }

    handleDelayedChange = (value) => {
        this.setState({query: value});
        this.props.dispatch(search(value, category));
    }

    handleBlur = () => {
        this.setState({query: ''});
        this.props.dispatch(clearResults());
        this.props.onBlur();
    }

    handleSelectItem = ({ payload }) => {
        this.props.onSelectProfile(payload);
    }

    getSections() {
        const { query } = this.state;
        const { ignoreProfileIds, resultFactoryFunction, results } = this.props;
        let section;
        if (query === '') {
            section = new Section([]);
        } else {
            let querySpecificResults = results[query];
            if (querySpecificResults) {
                querySpecificResults = querySpecificResults.filter(result => !ignoreProfileIds.includes(result.profile.id));
            }
            section = new Section(querySpecificResults, undefined, undefined, resultFactoryFunction);
        }
        return [section];
    }

    render() {
        const {
            onBlur,
            onSelectProfile,
            results,
            ...other,
        } = this.props;
        const sections = this.getSections();
        return (
            <Search
                maxListHeight={300}
                onBlur={this.handleBlur}
                onDelayedChange={this.handleDelayedChange}
                onSelectItem={this.handleSelectItem}
                resultHeight={40}
                searchContainerWidth={280}
                sections={sections}
                {...other}
            />
        );
    }

}

export { AutoCompleteProfile };
export default connect(selector)(AutoCompleteProfile);

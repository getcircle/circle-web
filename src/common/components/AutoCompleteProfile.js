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
        onSelectProfile: PropTypes.func.isRequired,
        // TODO add an "ignore" props so we can filter out items that have already been selected from the results
        resultFactoryFunction: PropTypes.func.isRequired,
        results: PropTypes.object,
    }

    state = {
        query: '',
    }

    handleDelayedChange = (value) => {
        this.setState({query: value});
        this.props.dispatch(search(value, category));
    }

    handleBlur = () => {
        this.setState({query: ''});
        this.props.dispatch(clearResults());
    }

    handleSelectItem = ({ payload }) => {
        this.props.onSelectProfile(payload);
    }

    getSections() {
        const { query } = this.state;
        let section;
        if (query === '') {
            section = new Section([]);
        } else {
            const querySpecificResults = this.props.results[query];
            section = new Section(querySpecificResults, undefined, undefined, this.props.resultFactoryFunction);
        }
        return [section];
    }

    render() {
        const {
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

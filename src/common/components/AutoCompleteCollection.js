import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import { clearCollectionsFilter, filterCollections } from '../actions/collections';

import Search from './Search';
import Section from './Search/Section';

const selector = selectors.createImmutableSelector(
    [selectors.filterCollectionsSelector],
    (filterCollectionsState) => {
        return {
            filteredCollections: filterCollectionsState.get('filteredCollections').toJS(),
        };
    },
);

export function createCollectionItem(collection) {
    const styles = {
        name: {
            fontSize: '1.4rem',
        },
    };

    const primaryText = <span style={styles.name}>{collection.name}</span>;
    const item = {
        primaryText: primaryText,
        innerDivStyle: {
            paddingTop: 10,
            paddingLeft: 20,
        },
        style: {
            fontSize: '1.4rem',
        },

    };
    return {
        item,
        type: 'collection',
        payload: collection,
    };
};

class AutoCompleteCollection extends Component {

    state = {
        query: '',
    }

    shouldComponentUpdate(nextProps, nextState) {
        // If the props haven't changed, we don't want to update the component.
        // Since we focus the Search input if `focused` is true, we can run
        // into an issue where it keeps focusing even if it hasn't lost focus.
        // This causes an issue when using this as a form field.
        const hasChanged = (
            nextProps.collections !== this.props.collections ||
            nextProps.ignoreCollectionIds !== this.props.ignoreCollectionIds ||
            nextProps.filteredCollections !== this.props.filteredCollections ||
            nextProps.filtered !== this.props.filtered ||
            nextState.query !== this.state.query ||
            nextProps.focused !== this.props.focused
        );
        return !!hasChanged;
    }

    handleDelayedChange = (value) => {
        this.setState({query: value});
        this.props.dispatch(filterCollections(value));
    }

    handleBlur = () => {
        this.setState({query: ''});
        this.props.dispatch(clearCollectionsFilter());
        this.props.onBlur();
    }

    handleSelectItem = ({ payload }) => {
        this.props.onSelectItem(payload);
    }

    getSections() {
        const { query } = this.state;
        const {
            collections,
            filteredCollections,
            ignoreCollectionIds,
            resultFactoryFunction,
        } = this.props;

        let sectionResults = query === '' ? collections : filteredCollections;
        sectionResults = sectionResults.filter((collection) => {
            return !ignoreCollectionIds.includes(collection.id);
        });

        const section = new Section(
            sectionResults,
            undefined,
            undefined,
            resultFactoryFunction,
        );
        return [section];
    }

    render() {
        const {
            onBlur,
            onSelectItem,
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

AutoCompleteCollection.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    filtered: PropTypes.bool,
    filteredCollections: PropTypes.array,
    focused: PropTypes.bool,
    ignoreCollectionIds: PropTypes.arrayOf(PropTypes.string),
    onBlur: PropTypes.func,
    onSelectItem: PropTypes.func,
    resultFactoryFunction: PropTypes.func.isRequired,
};

AutoCompleteCollection.defaultProps = {
    focued: false,
    collections: [],
    ignoreCollectionIds: [],
    onBlur: () => {},
    onSelectItem: () => {},
};

export { AutoCompleteCollection };
export default connect(selector)(AutoCompleteCollection);

import keymirror from 'keymirror';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../selectors';
import t from '../../utils/gettext';
import { clearCollectionsFilter, filterCollections } from '../../actions/collections';

import CheckIcon from '../CheckIcon';
import CollectionIcon from '../CollectionIcon';
import PlusIcon from '../PlusIcon';
import Search from '../Search';
import Section from './Section';

export const TYPES = keymirror({
    COLLECTION: null,
    ADD_COLLECTION: null,
});

const selector = selectors.createImmutableSelector(
    [selectors.filterCollectionsSelector],
    (filterCollectionsState) => {
        return {
            filteredCollections: filterCollectionsState.get('filteredCollections').toJS(),
        };
    },
);

export function createCollectionItem(collection, selectedCollectionIds = [], muiTheme) {
    const styles = {
        name: {
            display: 'block',
            fontSize: '1.4rem',
            width: 280,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        selected: {
            color: muiTheme.luno.tintColor,
        },
    };

    const selected = selectedCollectionIds.includes(collection.id);
    let icon;
    if (selected) {
        icon = <CheckIcon stroke={muiTheme.luno.tintColor} />;
    } else {
        icon = <CollectionIcon />;
    }

    let style = styles.name;
    if (selected) {
        style = {...styles.name, ...styles.selected};
    }
    const primaryText = <span style={style}>{collection.display_name}</span>;
    const item = {
        leftIcon: icon,
        primaryText: primaryText,
        innerDivStyle: {
            paddingLeft: 45,
        },
        style: {
            fontSize: '1.4rem',
        },

    };
    return {
        item,
        type: TYPES.COLLECTION,
        payload: collection,
    };
};

export function createNewCollectionItem() {
    const styles = {
        name: {
            display: 'block',
            fontSize: '1.4rem',
            width: 280,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    };
    const primaryText = <span style={styles.name}>{t('New Collection')}</span>;
    const item = {
        leftIcon: <PlusIcon />,
        primaryText: primaryText,
        innerDivStyle: {
            paddingLeft: 45,
        },
        style: {
            fontSize: '1.4rem',
        },

    };
    return {
        item,
        type: TYPES.ADD_COLLECTION,
        payload: TYPES.ADD_COLLECTION,
    };
}

// TODO i would like to have combined this with AutoCompleteCollection, but direct subclass doesn't work
class AutoCompleteAddToCollection extends Component {

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

    handleSelectItem = ({ payload }, event) => {
        this.props.onSelectItem(payload, event);
    }

    getSections() {
        const { query } = this.state;
        const {
            collections,
            filteredCollections,
            ignoreCollectionIds,
            newCollectionFactoryFunction,
            resultFactoryFunction,
        } = this.props;

        const sections = [];

        if (newCollectionFactoryFunction) {
            const addCollectionItem = newCollectionFactoryFunction()
            sections.push(new Section([addCollectionItem], undefined, undefined));
        }

        const sectionResults = query === '' ? collections : filteredCollections;
        sections.push(new Section(
            sectionResults,
            undefined,
            undefined,
            resultFactoryFunction,
            ignoreCollectionIds,
            this.context.muiTheme,
        ));

        return sections;
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

AutoCompleteAddToCollection.propTypes = {
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    filtered: PropTypes.bool,
    filteredCollections: PropTypes.array,
    focused: PropTypes.bool,
    ignoreCollectionIds: PropTypes.arrayOf(PropTypes.string),
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    newCollectionFactoryFunction: PropTypes.func,
    onBlur: PropTypes.func,
    onSelectItem: PropTypes.func,
    resultFactoryFunction: PropTypes.func.isRequired,
};

AutoCompleteAddToCollection.defaultProps = {
    focued: false,
    collections: [],
    ignoreCollectionIds: [],
    onBlur: () => {},
    onSelectItem: () => {},
};

AutoCompleteAddToCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default connect(selector)(AutoCompleteAddToCollection);

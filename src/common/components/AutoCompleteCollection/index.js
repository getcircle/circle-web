import keymirror from 'keymirror';
import { Paper } from 'material-ui';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../selectors';
import t from '../../utils/gettext';
import { clearCollectionsFilter, filterCollections } from '../../actions/collections';

import CheckIcon from '../CheckIcon';
import CollectionIcon from '../CollectionIcon';
import NewCollectionForm from './NewCollectionForm';
import PlusIcon from '../PlusIcon';
import Search from '../Search';
import Section from './Section';

export const TYPES = keymirror({
    COLLECTION: null,
    ADD_COLLECTION: null,
});

export const NEW_ITEM_POSITION = keymirror({
    TOP: null,
    BOTTOM: null,
})

// Ensure that there's room in Search for the new collection item
const MAX_SEARCH_RESULTS = 6;

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

    const primaryText = <span style={styles.name}>{collection.display_name}</span>;
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

export function createCollectionItemWithIcon(collection, selectedCollectionIds = [], muiTheme) {
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

class AutoCompleteCollection extends Component {

    state = {
        initialName: '',
        query: '',
    }

    componentWillMount() {
        this.setState({query: ''});
        this.props.dispatch(clearCollectionsFilter());
    }

    shouldComponentUpdate(nextProps, nextState) {
        // If the props haven't changed, we don't want to update the component.
        // Since we focus the Search input if `focused` is true, we can run
        // into an issue where it keeps focusing even if it hasn't lost focus.
        // This causes an issue when using this as a form field.
        const hasChanged = (
            nextProps.addingNewCollection !== this.props.addingNewCollection ||
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
        this.props.onBlur();
    }

    handleSelectItem = ({ payload }, event) => {
        if (payload === TYPES.ADD_COLLECTION) {
            this.setState({
                initialName: this.state.query,
            });
            this.props.onOpenNewForm();
        } else {
            this.props.onSelectItem(payload, event);
        }
    }

    handleNewCollection = (collection) => {
        this.props.onSelectItem(collection);
        this.props.onCloseNewForm();
    }

    handleCloseNewCollection = () => {
        this.props.onCloseNewForm();
    }

    getSections() {
        const { query } = this.state;
        const {
            collections,
            filteredCollections,
            hideSelectedCollections,
            ignoreCollectionIds,
            newCollectionPosition,
            resultFactoryFunction,
        } = this.props;

        let results = query === '' ? collections : filteredCollections;

        if (hideSelectedCollections) {
            results = results.filter(result => !ignoreCollectionIds.includes(result.id));
        }

        results = results.slice(0, MAX_SEARCH_RESULTS)
        const sections = [new Section(
            results,
            undefined,
            undefined,
            resultFactoryFunction,
            ignoreCollectionIds,
            this.context.muiTheme,
        )];

        const newCollectionSection = new Section(
            [createNewCollectionItem()],
            undefined,
            undefined
        );
        switch(newCollectionPosition) {
        case NEW_ITEM_POSITION.TOP:
            sections.unshift(newCollectionSection);
            break;
        case NEW_ITEM_POSITION.BOTTOM:
            sections.push(newCollectionSection);
            break;
        }

        return sections;
    }

    render() {
        const {
            addingNewCollection,
            hideSearchWhenAdding,
            listContainerStyle,
            memberships,
            newCollectionButtonText,
            newCollectionStyle,
            onBlur,
            onSelectItem,
            ...other,
        } = this.props;
        const { initialName } = this.state;
        const sections = addingNewCollection ? [] : this.getSections();

        let newForm;
        if (addingNewCollection) {
            newForm = (
                <Paper style={newCollectionStyle}>
                    <NewCollectionForm
                        buttonText={newCollectionButtonText}
                        initialName={initialName}
                        memberships={memberships}
                        onClickAway={this.handleCloseNewCollection}
                        onCreate={this.handleNewCollection}
                    />
                </Paper>
            );
        }

        let search;
        if (!addingNewCollection || !hideSearchWhenAdding) {
            search = (
                <Search
                    listContainerStyle={listContainerStyle}
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

        return (
            <div>
                {search}
                {newForm}
            </div>
        );
    }

}

AutoCompleteCollection.propTypes = {
    addingNewCollection: PropTypes.bool,
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    filtered: PropTypes.bool,
    filteredCollections: PropTypes.array,
    focused: PropTypes.bool,
    hideSearchWhenAdding: PropTypes.bool,
    hideSelectedCollections: PropTypes.bool,
    ignoreCollectionIds: PropTypes.arrayOf(PropTypes.string),
    inputContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,
    memberships: PropTypes.array,
    newCollectionButtonText: PropTypes.string,
    newCollectionPosition: PropTypes.oneOf([NEW_ITEM_POSITION.TOP, NEW_ITEM_POSITION.BOTTOM]),
    newCollectionStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onCloseNewForm: PropTypes.func.isRequired,
    onOpenNewForm: PropTypes.func.isRequired,
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

AutoCompleteCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default connect(selector)(AutoCompleteCollection);

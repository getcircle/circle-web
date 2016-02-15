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

const createResult = ({ profile, highlight }) => {
    const styles = {
        name: {
            fontSize: '14px',
        },
        title: {
            color: '#808080',
            fontSize: '11px',
        },
    };

    let fullName, title;
    if (highlight && highlight.get('full_name')) {
        fullName = <span style={styles.name} dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />;
    } else {
        fullName = <span style={styles.name}>{profile.full_name}</span>;
    }

    if (highlight && highlight.get('title')) {
        title = <span dangerouslySetInnerHTML={{__html: highlight.get('title')}} />;
    } else {
        title = <span>{profile.title}</span>;
    }

    const primaryText = (
        <div>
            {fullName}<span style={styles.title}>{' ('}{title}{')'}</span>
        </div>
    );
    const item = {
        primaryText: primaryText,
        innerDivStyle: {
            paddingTop: 10,
            paddingLeft: 20,
        },
        style: {
            fontSize: '14px',
        },
    };
    return {
        item,
        type: 'profile',
        payload: profile,
    };

};

class AutoCompleteProfile extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        onSelectProfile: PropTypes.func.isRequired,
        // TODO add an "ignore" props so we can filter out items that have already been selected from the results
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
            section = new Section(querySpecificResults, undefined, undefined, createResult);
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

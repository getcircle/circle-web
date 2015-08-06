'use strict';

import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';

import constants from '../styles/constants';
import SearchResults from '../components/SearchResults';
import t from '../utils/gettext';

const {
    TextField,
} = mui;

class Typeahead extends React.Component {

    styles = {
        container: {
            backgroundColor: 'white',
            marginTop: 11,
        },
        input: {
            width: 350,
            height: '100%',
            border: 'none',
            padding: 10,
            fontSize: 13,
            outline: 'none',
        },
        searchResults: {
            zIndex: 10,
            position: 'absolute',
            width: 373,
            backgroundColor: 'white',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
        },
        text: {
            color: constants.colors.lightText,
        },
    }

    _renderSearchResults() {
        if (this.props.results && this.props.results.length) {
            return (
                <div className="start-xs">
                    <SearchResults style={this.styles.searchResults} results={this.props.results} flux={this.props.flux} />
                </div>
            );
        }
    }

    render() {
        return (
            <div style={this.styles.container}>
                <input
                    placeholder={this.props.floatingLabelText || t('Search')}
                    valueLink={this.props.valueLink}
                    onKeyUp={this.props.onKeyUp}
                    style={this.styles.input}
                />
                {this._renderSearchResults()}
            </div>
        );
    }

}

export default Typeahead;

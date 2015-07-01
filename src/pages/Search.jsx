'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';
import { services } from 'protobufs';

import connectToStore from '../utils/connectToStore';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';

const {TextField} = mui;

@connectToStore
@decorate(React.addons.LinkedStateMixin)
class Search extends React.Component {

    static store = 'SearchStore';

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        results: React.PropTypes.array.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            query: null,
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _handleKeyUp = this._handleKeyUp.bind(this)
    _handleKeyUp(event) {
        let query = this.state.query && this.state.query.trim();
        if (query !== null && query !== '') {
            this.props.flux.getStore('SearchStore').search(query);
        }
    }

    _renderSearchResults() {
        const {CategoryV1} = services.search.containers.search;
        let components = [];
        for (let result of this.props.results) {
            if (result.category === CategoryV1.PROFILES) {
                components.push(this._renderProfileSearchResults(result.profiles));
            }
        }
        return components;
    }

    _renderProfileSearchResults(profiles) {
        return profiles.map((profile, index) => {
            return (
                <li key={index}>
                    <p>{profile.full_name}</p>
                    <p>{profile.title}</p>
                </li>
            );
        });
    }

    render() {
        return (
            <section>
                <div className="row center-xs">
                    <h1>{ t('Search') }</h1>
                </div>
                <div className="row center-xs">
                    <TextField
                        className="row center-xs"
                        floatingLabelText="Search"
                        valueLink={this.linkState('query')}
                        onKeyUp={this._handleKeyUp}
                    />
                </div>
                <div className="row center-xs">
                    {this._renderSearchResults()}
                </div>
            </section>
        );
    }
}

export default Search;

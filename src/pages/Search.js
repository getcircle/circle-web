import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React from 'react/addons';

import SearchResults from '../components/SearchResults';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

const { TextField } = mui;

const selector = createSelector(
    [selectors.searchSelector],
    (searchState) => { return {results: searchState.results } },
)

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
class Search extends React.Component {

    static propTypes = {
        results: React.PropTypes.array.isrequired,
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
        this.props.flux.getStore('SearchStore').search(this.state.query);
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
                    <SearchResults className="col-xs-8" results={this.props.results} />
                </div>
            </section>
        );
    }
}

export default Search;

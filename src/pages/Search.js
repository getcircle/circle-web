import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';

import connectToStore from '../utils/connectToStore';
import SearchResults from '../components/SearchResults';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';

const {TextField} = mui;

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

    componentWillUnmount() {
        // XXX we don't want to clear the search results if you're clicking on a search result
        this.props.flux.getActions('SearchActions').clearResults();
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

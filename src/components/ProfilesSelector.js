import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';
import Immutable from 'immutable';

import { loadSearchResults } from '../actions/search';
import * as exploreActions from '../actions/explore';
import { retrieveProfiles } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import { PAGE_TYPE } from '../constants/trackerProperties';

import CSSComponent from  './CSSComponent';
import SelectField from './SelectField';
import SelectDialog from './SelectDialog';

const cacheSelector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.exploreProfilesIdsSelector,
    ],
    (
        cacheState,
        profilesState,
    ) => {
        let profiles, profilesNextRequest;
        const cache = cacheState.toJS();
        if (profilesState) {
            const ids = profilesState.get('ids').toJS();
            if (ids.length) {
                profiles = retrieveProfiles(ids, cache);
            }
            profilesNextRequest = profilesState.get('nextRequest');
        }
        return Immutable.fromJS({
            profiles,
            profilesNextRequest,
        });
    },
);

const selector = selectors.createImmutableSelector(
    [
        cacheSelector,
        selectors.searchSelector,
        selectors.exploreProfilesLoadingSelector,
    ],
    (
        cacheState,
        searchState,
        profilesLoadingState,
    ) => {
        return {
            ...cacheState.toJS(),
            results: searchState.get('results').toJS(),
            profilesLoading: (
                profilesLoadingState || searchState.get('loading')
            ),
        };
    }
);

@connect(selector)
class ProfilesSelector extends CSSComponent {

    static propTypes = {
        arrowIconContainerStyle: PropTypes.object,
        arrowIconStyle: PropTypes.object,
        dialogListStyle: PropTypes.object,
        dialogSearchIconStyle: PropTypes.object,
        dialogSearchInputContainerStyle: PropTypes.object,
        dialogSearchInputStyle: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        fieldInputStyle: PropTypes.object,
        fieldListStyle: PropTypes.object,
        fieldSearchIconStyle: PropTypes.object,
        fieldSearchInputStyle: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        listDividerStyle: PropTypes.object,
        listItemInnerDivStyle: PropTypes.object,
        listItemPrimaryTextStyle: PropTypes.object,
        onSelect: PropTypes.func,
        profiles: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        profilesLoading: PropTypes.bool,
        profilesNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        results: PropTypes.arrayOf(PropTypes.instanceOf(services.search.containers.SearchResultV1)),
        searchInputPlaceholder: PropTypes.string,
        value: PropTypes.string,
    }

    static defaultProps = {
        onSelect: () => {}
    }

    state = {
        query: '',
    }

    componentWillMount() {
        this.handleInfiniteLoad();
    }

    currentSearchTimeout = null

    getItems() {
        const searchResults = this.props.results[this.state.query];

        let items = [];

        if (this.state.query.length === 0) {
            const { profiles } = this.props;
            if (profiles) {
                items = profiles.map((profile, index) => {
                    const item = {
                        primaryText: profile.full_name,
                        onTouchTap: this.props.onSelect.bind(this, profile)
                    };
                    return item
                });
            }
        } else if (!!searchResults) {
            items = searchResults.map((result, index) => {
                const item = {
                    primaryText: result.profile.full_name,
                    onTouchTap: this.props.onSelect.bind(this, result.profile)
                };
                return item
            });
        }

        return items
    }

    handleBlur() {
        this.setState({query: ''});
    }

    handleInfiniteLoad() {
        this.props.dispatch(exploreActions.exploreProfiles(this.props.profilesNextRequest));
    }

    handleInputChange(event) {
        if (this.currentSearchTimeout !== null) {
            window.clearTimeout(this.currentSearchTimeout);
        }

        let value = event.target.value;

        this.currentSearchTimeout = window.setTimeout(() => {
            this.props.dispatch(loadSearchResults(value, services.search.containers.search.CategoryV1.PROFILES));
        }, 300);

        this.setState({query: value});
    }

    renderField() {
        const {
            fieldInputStyle,
            fieldListStyle,
            fieldSearchIconStyle,
            fieldSearchInputStyle,
        } = this.props;

        return (
            <SelectField
                infiniteLoadBeginBottomOffset={100}
                inputStyle={fieldInputStyle}
                items={this.getItems()}
                listItemHeight={50}
                listStyle={fieldListStyle}
                maxListHeight={150}
                onBlur={::this.handleBlur}
                onInfiniteLoad={::this.handleInfiniteLoad}
                onInputChange={::this.handleInputChange}
                searchIconStyle={fieldSearchIconStyle}
                searchInputName="query"
                searchInputStyle={fieldSearchInputStyle}
                {...this.props}
            />
        );
    }

    renderDialog() {
        const {
            dialogListStyle,
            dialogSearchIconStyle,
            dialogSearchInputContainerStyle,
            dialogSearchInputStyle,
        } = this.props;

        return (
            <div>
                <input
                    onClick={() => this.refs.selectDialog.show()}
                    readOnly={true}
                    style={this.props.fieldInputStyle}
                    value={this.props.value}
                />
                <SelectDialog
                    infiniteLoadBeginBottomOffset={100}
                    items={this.getItems()}
                    listItemHeight={50}
                    listStyle={dialogListStyle}
                    onDismiss={::this.handleBlur}
                    onInfiniteLoad={::this.handleInfiniteLoad}
                    onInputChange={::this.handleInputChange}
                    pageType={PAGE_TYPE.PROFILE_SELECTOR}
                    ref="selectDialog"
                    searchIconStyle={dialogSearchIconStyle}
                    searchInputContainerStyle={dialogSearchInputContainerStyle}
                    searchInputStyle={dialogSearchInputStyle}
                    title={this.props.searchInputPlaceholder}
                    {...this.props}
                />
            </div>
        );
    }

    render() {
        let field;
        let dialog;
        if (this.props.largerDevice) {
            field = this.renderField();
        } else {
            dialog = this.renderDialog();
        }

        return (
            <div>
                {field}
                {dialog}
            </div>
        );
    }
}

export default ProfilesSelector;

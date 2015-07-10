'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import bindThis from '../utils/bindThis';
import ThemeManager from '../utils/ThemeManager';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import InfiniteCardGrid from '../components/InfiniteCardGrid';
import ProfileTile from '../components/ProfileTile';
import TagButton from '../components/TagButton';

function _getTagId(props) {
    return props.location.query && props.location.query.tagId;
}

@connectToStores
class Profiles extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        profiles: React.PropTypes.array,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool.isRequired,
        tag: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    static getStores(props) {
        return [props.flux.getStore('ProfileStore')];
    }

    static getPropsFromStores(props) {
        const store = props.flux.getStore('ProfileStore');
        const tagId = _getTagId(props);
        let storeProps = {
            loading: store.getState().loading,
        };
        storeProps.profiles = store.getProfilesForTagId(tagId);
        storeProps.nextRequest = store.getNextRequestForTagId(tagId);
        storeProps.tag = store.getTag(tagId);
        return storeProps;
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this._fetchContent(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // this seems really fragile to me
        if (!nextProps.loading && this.props.location !== nextProps.location) {
            this._fetchContent(nextProps);
        }
    }

    @bindThis
    getMore(props, nextRequest) {
        const tagId = _getTagId(props);
        let parameters = {};
        if (tagId) {
            parameters['tag_id'] = tagId;
        }
        props.flux.getStore('ProfileStore').fetchProfiles(parameters, nextRequest);
    }

    _fetchContent(props) {
        this.getMore(props);
        const tagId = _getTagId(props);
        if (tagId) {
            props.flux.getStore('ProfileStore').fetchTag(tagId);
        }
    }

    _isLoading() {
        return !this.props.profiles || (_getTagId(this.props) && !this.props.tag);
    }

    _renderFilter() {
        const { tag } = this.props;
        if (tag) {
            return (
                <div className="row center-xs">
                    <TagButton tag={tag} disabled={true} />
                </div>
            );
        }
    }

    render() {
        if (this._isLoading()) {
            return <CenterLoadingIndicator />;
        } else {
            return (
                <div className="wrap">
                    {this._renderFilter()}
                    <InfiniteCardGrid
                        objects={this.props.profiles}

                        loading={this.props.loading}
                        getMore={this.getMore.bind(this, this.props, this.props.nextRequest)}

                        ComponentClass={ProfileTile}
                        componentAttributeName='profile'
                    />
                </div>
            );
        }
    }

}

export default Profiles;

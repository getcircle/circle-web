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

class Profiles extends React.Component {

    static propTypes = {
        profiles: React.PropTypes.array,
        nextRequest: React.PropTypes.object,
        tag: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        debugger;
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        debugger;
        this._fetchContent(this.props);
    }

    componentWillReceiveProps(nextProps) {
        debugger;
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
        debugger;
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
        debugger;
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

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { loadProfiles } from '../actions/profiles';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import InfiniteCardGrid from '../components/InfiniteCardGrid';
import ProfileTile from '../components/ProfileTile';
import TagButton from '../components/TagButton';

const selector = createSelector(
    [selectors.profilesSelector],
    (profilesState) => {
        return {
            profiles: profilesState.get('filter'),
            nextRequest: profilesState.get('nextRequest'),
            loading: profilesState.get('loading'),
        }
    }
)

@connect(selector)
class Profiles extends React.Component {

    static propTypes = {
        profiles: ImmutablePropTypes.list,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this.getMore(this.props);
    }

    getMore(props, nextRequest) {
        props.dispatch(loadProfiles({}, nextRequest));
    }

    _isLoading() {
        return !this.props.profiles;
    }

    render() {
        if (this._isLoading()) {
            return <CenterLoadingIndicator />;
        } else {
            return (
                <div className="wrap">
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

'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import ThemeManager from '../utils/ThemeManager';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import LocationsOverview from '../components/LocationsOverview';

@connectToStores
class Locations extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        locations: React.PropTypes.array,
        loading: React.PropTypes.bool.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    static getStores(props) {
        return [props.flux.getStore('LocationStore')];
    }

    static getPropsFromStores(props) {
        const store = props.flux.getStore('LocationStore');
        let storeProps = {
            loading: store.getState().loading,
            locations: store.getState().organizationLocations,
        };
        return storeProps;
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this.props.flux.getStore('LocationStore').fetchLocations();
    }

    render() {
        if (this.props.loading) {
            return <CenterLoadingIndicator />;
        } else {
            return (
                <section className="wrap">
                    <LocationsOverview locations={this.props.locations} />
                </section>
            );
        }
    }
}

export default Locations;

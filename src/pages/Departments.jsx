'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import BasePage from './BasePage';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import TeamsOverview from '../components/TeamsOverview';

@connectToStores
class Departments extends BasePage {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        departments: React.PropTypes.array,
        loading: React.PropTypes.bool.isRequired,
    }

    static getStores(props) {
        return [props.flux.getStore('TeamStore')];
    }

    static getPropsFromStores(props) {
        return props.flux.getStore('TeamStore').getState();
    }

    componentWillMount() {
        this.props.flux.getStore('TeamStore').fetchDepartments();
    }

    render() {
        if (this.props.loading) {
            return <CenterLoadingIndicator />;
        } else {
            return (
                <section className="wrap">
                    <TeamsOverview teams={this.props.departments} />
                </section>
            );
        }
    }
}

export default Departments;

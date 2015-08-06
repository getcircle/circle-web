import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

const connectToStore = (Spec, Component = Spec) => {

    if (Spec.store === undefined) {
        throw new Error('connectToStore() expects the wrapped component to have a static "store" property');
    }

    class ConfiguredComponent extends React.Component {

        static getStores(props) {
            return [props.flux.getStore(Spec.store)];
        }

        static getPropsFromStores(props) {
            return props.flux.getStore(Spec.store).getState();
        }

        render() {
            return React.createElement(
                Component,
                _.assign({}, this.props, this.state),
            );
        }

    }

    return connectToStores(ConfiguredComponent);

};

export default connectToStore;

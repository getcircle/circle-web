import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';

import autoBind from '../utils/autoBind';

const { StyleResizable } = mui.Mixins;

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export default function resizable(WrappedComponent) {
    @decorate(StyleResizable)
    @decorate(autoBind(StyleResizable))
    class Resizable extends Component {
        static displayName = `Resizable(${getDisplayName(WrappedComponent)})`;

        render() {
            const props = {
                ...this.props,
                ...this.state,
            };
            props.largerDevice = props.deviceSize !== this.constructor.Sizes.SMALL;
            return <WrappedComponent {...props} />;
        }
    }

    return Resizable;
}

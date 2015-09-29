import Events from 'material-ui/lib/utils/events';
import React, { Component } from 'react';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const Sizes = {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
}

export default function resizable(WrappedComponent) {
    class Resizable extends Component {
        static displayName = `Resizable(${getDisplayName(WrappedComponent)})`;

        componentDidMount() {
            this.updateDeviceSize();
            this.bindResize();
        }

        componentWillUnmount() {
            this.unbindResize();
        }

        bindResize() {
            Events.on(window, 'resize', this.updateDeviceSize.bind(this));
        }

        unbindResize() {
            Events.off(window, 'resize', this.updateDeviceSize.bind(this));
        }

        getDeviceSize() {
            const width = window.innerWidth;
            if (width >= 992) {
                return Sizes.LARGE;
            } else if (width >= 768) {
                return Sizes.MEDIUM;
            } else {
                return Sizes.SMALL;
            }
        }

        updateDeviceSize() {
            const deviceSize = this.getDeviceSize();
            this.setState({deviceSize});
        }

        render() {
            const props = {
                deviceSize: this.getDeviceSize(),
                ...this.props,
                ...this.state,
            };
            props.largerDevice = props.deviceSize !== Sizes.SMALL;
            return <WrappedComponent {...props} />;
        }
    }

    return Resizable;
}

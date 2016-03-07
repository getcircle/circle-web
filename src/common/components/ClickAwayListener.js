// Based on https://github.com/callemall/material-ui/blob/b9bb7b02d5224d5600075155b1cdb2d723d17254/src/ClickAwayListener.jsx
// Material-UI doesn't expose this component directly, and this modifies their
// component to allow specifying ignored class names.
import { intersection } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const isDescendantOrIgnored = (el, target, ignoredClassNames) => {
    if (target !== null) {
        const isTarget = el === target;
        const isIgnored = intersection(target.classList, ignoredClassNames).length > 0;
        return isTarget || isIgnored || isDescendantOrIgnored(el, target.parentNode, ignoredClassNames);
    }
    return false;
};

const clickAwayEvents = ['mousedown', 'touchstart'];
const bind = (callback) => clickAwayEvents.forEach(event => document.addEventListener(event, callback));
const unbind = (callback) => clickAwayEvents.forEach(event => document.removeEventListener(event, callback));

class ClickAwayListener extends Component {

    componentDidMount() {
        if (this.props.onClickAway) {
            bind(this.handleClickAway);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.onClickAway !== this.props.onClickAway) {
            unbind(this.handleClickAway);
            if (this.props.onClickAway) {
                bind(this.handleClickAway);
            }
        }
    }

    componentWillUnmount() {
        unbind(this.handleClickAway);
    }

    handleClickAway = (event) => {
        if (event.defaultPrevented) {
            return;
        }

        const { ignoredClassNames, onClickAway } = this.props;
        const el = ReactDOM.findDOMNode(this);
        const inDOM = document.documentElement.contains(event.target);

        if (inDOM && !isDescendantOrIgnored(el, event.target, ignoredClassNames)) {
            onClickAway(event);
        }
    };

    render() {
        const { children, ...other } = this.props;
        return (
            <div {...other}>
                {children}
            </div>
        );
    }
}

ClickAwayListener.propTypes = {
    children: PropTypes.node,
    ignoredClassNames: PropTypes.arrayOf(PropTypes.string),
    onClickAway: PropTypes.any,
};

export default ClickAwayListener;

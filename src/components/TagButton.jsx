'use strict';

import mui from 'material-ui';
import React from 'react';

import bindThis from '../utils/bindThis';

const { FlatButton } = mui;

const styles = {
    tag: {
        margin: 10,
        border: 'solid 1px #d9d9d9',
        textTransform: 'none',
        fontWeight: 'normal',
    },
};

class TagButton extends React.Component {

    static propTypes = {
        tag: React.PropTypes.object.isRequired,
    }

    @bindThis
    _handleClick() {
        debugger;
    }

    render() {
        return <FlatButton style={styles.tag} label={this.props.tag.name} onClick={this._handleClick} />;
    }

}

export default TagButton;

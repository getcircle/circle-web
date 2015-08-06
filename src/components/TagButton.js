'use strict';

import mui from 'material-ui';
import React from 'react';

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

    render() {
        return <FlatButton style={styles.tag} label={this.props.tag.name} {...this.props} />;
    }

}

export default TagButton;

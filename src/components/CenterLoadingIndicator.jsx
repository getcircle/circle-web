'use strict';

import mui from 'material-ui';
import React from 'react';

const { CircularProgress } = mui;

class CenterLoadingIndicator extends React.Component {

    styles = {
        container: {
            minHeight: '100vh',
        },
    }

    render() {
        return (
            <div style={this.styles.container} className="row middle-xs center-xs">
                <CircularProgress mode="indeterminate" size={2} />
            </div>
        );
    }
}

export default CenterLoadingIndicator;

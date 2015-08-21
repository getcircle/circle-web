import { CircularProgress } from 'material-ui';
import React from 'react';

class CenterLoadingIndicator extends React.Component {

    styles = {
        container: {
            minHeight: '100vh',
        },
    }

    render() {
        return (
            <div style={this.styles.container} className="row middle-xs center-xs">
                <CircularProgress mode="indeterminate" size={1} />
            </div>
        );
    }
}

export default CenterLoadingIndicator;
